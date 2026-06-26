import os
import re

webcontent_dir = r'C:\Users\HP\eclipse-workspace\OrveraRedesign\WebContent'

preloader_html = """
    <!-- PRELOADER -->
    <div id="preloader">
        <div class="preloader-content">
            <span class="preloader-text">Loading... Please wait</span>
            <div class="preloader-dots">
                <span></span><span></span><span></span>
            </div>
        </div>
    </div>
"""

def modify_html_files():
    for file in os.listdir(webcontent_dir):
        if file.endswith('.html'):
            path = os.path.join(webcontent_dir, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()

            modified = False

            # 1. Remove quick-actions-panel
            if 'quick-actions-panel' in content:
                content = re.sub(r'\s*<div class="quick-actions-panel">.*?</div>', '', content, flags=re.DOTALL)
                modified = True

            # 2. Add Preloader HTML after <body>
            if 'id="preloader"' not in content:
                # Find body tag
                body_match = re.search(r'(<body[^>]*>)', content, re.IGNORECASE)
                if body_match:
                    body_tag = body_match.group(1)
                    content = content.replace(body_tag, f"{body_tag}\n{preloader_html}")
                    modified = True

            # 3. index.html specific modifications
            if file == 'index.html':
                # Swap headings
                # Hero heading: swap "Sustainable Choices.<br>\s*Timeless Design." with "Sustainability Meets<br>\s*Sophistication"
                hero_pattern = r'<h1>\s*Sustainable Choices\.<br>\s*Timeless Design\.\s*</h1>'
                if re.search(hero_pattern, content):
                    content = re.sub(hero_pattern, '<h1>\n                Sustainability Meets<br>\n                Sophistication\n            </h1>', content)
                    modified = True

                # About heading: swap "<h2>Sustainability Meets Sophistication</h2>" with "<h2>Sustainable Choices. Timeless Design.</h2>"
                about_pattern = r'<h2>Sustainability Meets Sophistication</h2>'
                if about_pattern in content:
                    content = content.replace(about_pattern, '<h2>Sustainable Choices. Timeless Design.</h2>')
                    modified = True

                # Replace hero-tag span with Orvera logo in the Hero section
                hero_tag_pattern = r'<span class="hero-tag">\s*Premium Sustainable Solutions\s*</span>'
                if re.search(hero_tag_pattern, content):
                    logo_block = """<div class="hero-logo-container" style="margin-bottom: 20px;">
                <img src="images/logo.png?v=5" alt="ORVERA Logo" class="hero-logo-img" style="max-height: 80px; width: auto; filter: drop-shadow(0 2px 8px rgba(0,0,0,0.15));">
            </div>"""
                    content = re.sub(hero_tag_pattern, logo_block, content)
                    modified = True

                # Change 2nd feature card text
                old_desc = """<p>
                        Elegant, splinter-free products crafted to reflect a refined
                        and professional brand image.
                    </p>"""
                new_desc = """<p>
                        Premium splinter-free products crafted to deliver elegance,
                        quality, and a distinguished brand experience.
                    </p>"""
                if old_desc in content:
                    content = content.replace(old_desc, new_desc)
                    modified = True
                else:
                    # Fallback pattern matching
                    alt_pattern = r'<p>\s*Elegant, splinter-free products crafted to reflect.*?brand image\.\s*</p>'
                    content = re.sub(alt_pattern, '<p>\n                        Premium splinter-free products crafted to deliver elegance,\n                        quality, and a distinguished brand experience.\n                    </p>', content, flags=re.DOTALL)
                    modified = True

                # Change reviews section heading
                old_review_head = """<div class="section-heading">
                <span>CLIENT FEEDBACK</span>
                <h2>Trusted by Premium Hospitality</h2>
            </div>"""
                new_review_head = """<div class="section-heading">
                <h2>Client Feedback</h2>
            </div>"""
                if old_review_head in content:
                    content = content.replace(old_review_head, new_review_head)
                    modified = True
                else:
                    alt_review_pattern = r'<div class="section-heading">\s*<span>CLIENT FEEDBACK</span>\s*<h2>Trusted by Premium Hospitality</h2>\s*</div>'
                    content = re.sub(alt_review_pattern, '<div class="section-heading">\n                <h2>Client Feedback</h2>\n            </div>', content, flags=re.DOTALL)
                    modified = True

            if modified:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Modified HTML: {file}")

def modify_css():
    css_path = os.path.join(webcontent_dir, 'css', 'style.css')
    with open(css_path, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'PRELOADER STYLES' not in content:
        preloader_css = """
/* =============================================
   PRELOADER STYLES
   ============================================= */
#preloader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #0a1812; /* Deep forest green */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100000;
    opacity: 1;
    visibility: visible;
    transition: opacity 0.4s cubic-bezier(0.25, 1, 0.5, 1), visibility 0.4s;
}

#preloader.fade-out {
    opacity: 0;
    visibility: hidden;
}

.preloader-content {
    text-align: center;
}

.preloader-text {
    font-family: 'Cormorant Garamond', serif;
    font-size: 24px;
    color: #FAF7F2;
    letter-spacing: 2px;
    font-weight: 300;
    display: block;
    margin-bottom: 15px;
    animation: pulseText 2s ease-in-out infinite;
}

.preloader-dots {
    display: flex;
    justify-content: center;
    gap: 6px;
}

.preloader-dots span {
    width: 6px;
    height: 6px;
    background-color: #c5a880; /* Gold */
    border-radius: 50%;
    display: inline-block;
    animation: preloaderBounce 1.4s infinite ease-in-out both;
}

.preloader-dots span:nth-child(1) {
    animation-delay: -0.32s;
}

.preloader-dots span:nth-child(2) {
    animation-delay: -0.16s;
}

@keyframes pulseText {
    0%, 100% { opacity: 0.6; transform: scale(0.98); }
    50% { opacity: 1; transform: scale(1); }
}

@keyframes preloaderBounce {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1.0); }
}
"""
        with open(css_path, 'a', encoding='utf-8') as f:
            f.write(preloader_css)
        print("Modified CSS: added preloader styles")
    else:
        print("CSS already contains preloader styles, skipping.")

def modify_js():
    js_path = os.path.join(webcontent_dir, 'js', 'script.js')
    with open(js_path, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'preloader' not in content:
        preloader_js = """
// Preloader Fade Out
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.classList.add('fade-out');
    setTimeout(() => preloader.remove(), 400);
  }
});

// Fallback preloader removal
setTimeout(() => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.classList.add('fade-out');
    setTimeout(() => preloader.remove(), 400);
  }
}, 3500);
"""
        with open(js_path, 'a', encoding='utf-8') as f:
            f.write(preloader_js)
        print("Modified JS: added preloader fade-out logic")
    else:
        print("JS already contains preloader logic, skipping.")

if __name__ == '__main__':
    modify_html_files()
    modify_css()
    modify_js()
