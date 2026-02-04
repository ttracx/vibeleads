import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ formId: string }> }
) {
  try {
    const { formId } = await params
    
    const form = await prisma.form.findUnique({
      where: { id: formId },
      select: {
        id: true,
        name: true,
        buttonText: true,
        successMessage: true,
        primaryColor: true,
        collectName: true,
        collectPhone: true,
      },
    })

    if (!form) {
      return new NextResponse('// Form not found', {
        headers: { 'Content-Type': 'application/javascript' },
        status: 404,
      })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vibeleads.vercel.app'

    const script = `
(function() {
  var form = ${JSON.stringify(form)};
  var apiUrl = "${appUrl}/api/leads";
  
  function createForm() {
    var container = document.getElementById('vibeleads-form');
    if (!container) {
      console.error('VibeLeads: Container #vibeleads-form not found');
      return;
    }

    var style = document.createElement('style');
    style.textContent = \`
      .vl-form { font-family: system-ui, -apple-system, sans-serif; max-width: 400px; }
      .vl-input { width: 100%; padding: 12px; margin-bottom: 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 16px; box-sizing: border-box; }
      .vl-input:focus { outline: none; border-color: \${form.primaryColor}; box-shadow: 0 0 0 3px \${form.primaryColor}20; }
      .vl-button { width: 100%; padding: 12px 24px; background: \${form.primaryColor}; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; transition: opacity 0.2s; }
      .vl-button:hover { opacity: 0.9; }
      .vl-button:disabled { opacity: 0.6; cursor: not-allowed; }
      .vl-success { padding: 16px; background: #ecfdf5; color: #065f46; border-radius: 8px; text-align: center; }
      .vl-error { padding: 12px; background: #fef2f2; color: #991b1b; border-radius: 8px; margin-bottom: 12px; font-size: 14px; }
    \`;
    document.head.appendChild(style);

    var html = '<form class="vl-form" id="vl-form-' + form.id + '">';
    ${form.collectName ? 'html += \'<input type="text" name="name" class="vl-input" placeholder="Your name">\';' : ''}
    html += '<input type="email" name="email" class="vl-input" placeholder="Your email" required>';
    ${form.collectPhone ? 'html += \'<input type="tel" name="phone" class="vl-input" placeholder="Phone number">\';' : ''}
    html += '<button type="submit" class="vl-button">' + form.buttonText + '</button>';
    html += '</form>';

    container.innerHTML = html;

    var formEl = document.getElementById('vl-form-' + form.id);
    formEl.addEventListener('submit', function(e) {
      e.preventDefault();
      
      var btn = formEl.querySelector('button');
      btn.disabled = true;
      btn.textContent = 'Submitting...';

      var formData = new FormData(formEl);
      var data = {
        formId: form.id,
        email: formData.get('email'),
        name: formData.get('name') || null,
        phone: formData.get('phone') || null,
        source: window.location.href
      };

      fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      .then(function(res) { return res.json(); })
      .then(function(result) {
        if (result.success) {
          container.innerHTML = '<div class="vl-success">' + result.message + '</div>';
        } else {
          var errorDiv = document.createElement('div');
          errorDiv.className = 'vl-error';
          errorDiv.textContent = result.error || 'Something went wrong';
          formEl.insertBefore(errorDiv, formEl.firstChild);
          btn.disabled = false;
          btn.textContent = form.buttonText;
        }
      })
      .catch(function() {
        var errorDiv = document.createElement('div');
        errorDiv.className = 'vl-error';
        errorDiv.textContent = 'Network error. Please try again.';
        formEl.insertBefore(errorDiv, formEl.firstChild);
        btn.disabled = false;
        btn.textContent = form.buttonText;
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createForm);
  } else {
    createForm();
  }
})();
`

    return new NextResponse(script, {
      headers: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'public, max-age=60',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    console.error('Embed script error:', error)
    return new NextResponse('// Error loading form', {
      headers: { 'Content-Type': 'application/javascript' },
      status: 500,
    })
  }
}
