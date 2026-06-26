import os
import re

webcontent_dir = r'C:\Users\HP\eclipse-workspace\OrveraRedesign\WebContent'

def modify_html_files():
    for file in os.listdir(webcontent_dir):
        if file.endswith('.html'):
            path = os.path.join(webcontent_dir, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()

            modified = False

            # Replace Navbar text with Logo image + text aligned using flexbox
            logo_pattern = re.compile(r'<a\s+[^>]*class=["\']logo["\'][^>]*>.*?ORVERA.*?</a>', re.DOTALL | re.IGNORECASE)
            logo_pattern_alt = re.compile(r'<a\s+[^>]*href=["\']index\.html["\'][^>]*class=["\']logo["\'][^>]*>.*?ORVERA.*?</a>', re.DOTALL | re.IGNORECASE)
            
            replacement = """<a href="index.html" class="logo" style="display: flex; align-items: center; gap: 10px; text-decoration: none;">
                <img src="images/logo.png?v=5" alt="ORVERA Logo" style="height: 38px; width: auto; object-fit: contain; vertical-align: middle;">
                <span>ORVERA</span>
            </a>"""

            if logo_pattern.search(content):
                content = logo_pattern.sub(replacement, content)
                modified = True
            elif logo_pattern_alt.search(content):
                content = logo_pattern_alt.sub(replacement, content)
                modified = True
            else:
                # Direct string search/replace fallback
                target_str = '<a class=\'logo\' href=\'index.html\'>\n                ORVERA\n            </a>'
                if target_str in content:
                    content = content.replace(target_str, replacement)
                    modified = True
                else:
                    target_str_alt = '<a href="index.html" class="logo">\n                ORVERA\n            </a>'
                    if target_str_alt in content:
                        content = content.replace(target_str_alt, replacement)
                        modified = True

            if modified:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Modified HTML: {file}")

def modify_css():
    css_path = os.path.join(webcontent_dir, 'css', 'style.css')
    with open(css_path, 'r', encoding='utf-8') as f:
        content = f.read()

    modified = False

    # Update .range-val to transparent borderless text
    old_range_val_styles = re.compile(r'\.range-val\s*\{.*?\}', re.DOTALL)
    new_range_val_styles = """.range-val {
    font-weight: 700;
    background: none !important;
    border: none !important;
    padding: 0 !important;
    width: 65px;
    text-align: center;
    color: var(--text-dark);
    display: inline-block;
    flex-shrink: 0;
}"""
    if old_range_val_styles.search(content):
        content = old_range_val_styles.sub(new_range_val_styles, content)
        modified = True

    # Update .calc-results to fit content without stretching
    old_calc_results_styles = re.compile(r'\.calc-results\s*\{.*?\}', re.DOTALL)
    new_calc_results_styles = """.calc-results {
    background: var(--bg-white);
    padding: 40px;
    border-radius: 12px;
    box-shadow: var(--shadow-light);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 20px;
    border-top: 5px solid var(--accent-gold);
    align-self: start;
}"""
    if old_calc_results_styles.search(content):
        content = old_calc_results_styles.sub(new_calc_results_styles, content)
        modified = True

    if modified:
        with open(css_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Modified CSS: updated range-val boxless style & calc-results height align")

def modify_js():
    js_path = os.path.join(webcontent_dir, 'js', 'script.js')
    with open(js_path, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'scrollRestoration' not in content:
        scroll_fix_js = """
// Prevent browser auto scroll restoration on reload
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.addEventListener('load', () => {
  window.scrollTo(0, 0);
});
"""
        # Place it at the very top of script.js
        content = scroll_fix_js + content
        with open(js_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Modified JS: added scroll restoration reset at the top")

if __name__ == '__main__':
    modify_html_files()
    modify_css()
    modify_js()
