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

            # 1. Swap footer to centered layout globally
            footer_pattern = re.compile(r'<footer>.*?</footer>', re.DOTALL)
            new_footer = """<footer>
        <div class="container" style="display:flex; flex-direction:column; align-items:center; text-align:center; gap:15px;">
            <div>
                <h3 style="color: var(--primary-gold); margin-bottom: 5px;">ORVERA</h3>
                <p style="margin-bottom: 5px;">Premium Eco-Friendly Products For A Sustainable Future.</p>
                <p style="font-size: 12px; opacity: 0.6;">© 2026 ORVERA. All Rights Reserved.</p>
            </div>
            <div id="admin-export-controls" style="display: none; gap: 10px; flex-wrap: wrap; justify-content: center;">
                <button id="footer-export-users-btn" class="secondary-btn" style="font-size:10px; padding:6px 12px; border-color:var(--border);">📥 Export User Database (Excel)</button>
                <button id="footer-export-reviews-btn" class="secondary-btn" style="font-size:10px; padding:6px 12px; border-color:var(--border);">💬 Export Reviews (Excel)</button>
            </div>
        </div>
    </footer>"""
            if footer_pattern.search(content):
                content = footer_pattern.sub(new_footer, content)
                modified = True

            # 2. Remove 5th FAQ question ("Where do you ship?")
            faq_pattern = re.compile(r'\s*<!-- FAQ Item 5 -->.*?</div>\s*</div>', re.DOTALL)
            if faq_pattern.search(content):
                content = faq_pattern.sub('', content)
                modified = True
            else:
                # Alt match for the accordion block
                alt_faq = re.search(r'<h3>Where do you ship\?</h3>.*?</div>\s*</div>', content, re.DOTALL)
                if alt_faq:
                    # Find parent item div
                    content = re.sub(r'\s*<div class="faq-item">\s*<div class="faq-header">\s*<h3>Where do you ship\?</h3>.*?</div>\s*</div>', '', content, flags=re.DOTALL)
                    modified = True

            # 3. index.html specific edits
            if file == 'index.html':
                # Increase Orvera Logo size in Hero section (change max-height: 80px to max-height: 120px)
                content = content.replace('max-height: 80px;', 'max-height: 120px;')
                modified = True

                # Remove ESG Certificate modal
                cert_modal_pattern = re.compile(r'\s*<!-- ESG CERTIFICATE MODAL -->.*?</div>\s*</div>', re.DOTALL)
                if cert_modal_pattern.search(content):
                    content = cert_modal_pattern.sub('', content)
                    modified = True

                # Remove Certificate panel in estimator
                cert_panel_pattern = re.compile(r'\s*<!-- Certificate Generator Panel -->.*?</div>\s*</div>', re.DOTALL)
                if cert_panel_pattern.search(content):
                    content = cert_panel_pattern.sub('', content)
                    modified = True

            # 4. products.html specific edits
            if file == 'products.html':
                # Remove ESG Certificate modal
                cert_modal_pattern = re.compile(r'\s*<!-- ESG CERTIFICATE MODAL -->.*?</div>\s*</div>', re.DOTALL)
                if cert_modal_pattern.search(content):
                    content = cert_modal_pattern.sub('', content)
                    modified = True

                # Remove Certificate panel in estimator
                cert_panel_pattern = re.compile(r'\s*<!-- Certificate Generator Panel -->.*?</div>\s*</div>', re.DOTALL)
                if cert_panel_pattern.search(content):
                    content = cert_panel_pattern.sub('', content)
                    modified = True

            # 5. why-orvera.html specific edits
            if file == 'why-orvera.html':
                # Remove "How We Compare" section
                compare_section_pattern = re.compile(r'\s*<!-- COMPARISON SECTION -->.*?<section class="cutlery-highlight">.*?</section>', re.DOTALL)
                if compare_section_pattern.search(content):
                    content = compare_section_pattern.sub('', content)
                    modified = True
                else:
                    alt_comp = re.search(r'<section class="cutlery-highlight">.*?</section>', content, re.DOTALL)
                    if alt_comp:
                        content = re.sub(r'\s*<section class="cutlery-highlight">.*?</section>', '', content, flags=re.DOTALL)
                        modified = True

            # 6. contact.html specific edits
            if file == 'contact.html':
                # Rename Email Address label
                content = content.replace('<label for="contact-email">Email Address</label>', '<label for="contact-email">Company\'s Email Address</label>')
                modified = True

                # Add GST No. input
                gst_block = """                <div class="form-group">
                    <label for="contact-company">Company Name</label>
                    <input type="text" id="contact-company" placeholder="e.g. Grand Banquet Catering">
                </div>
                
                <div class="form-group">
                    <label for="contact-gst">GST No.</label>
                    <input type="text" id="contact-gst" placeholder="e.g. 27AAAAA0000A1Z5">
                </div>"""
                old_company_block = """                <div class="form-group">
                    <label for="contact-company">Company Name</label>
                    <input type="text" id="contact-company" placeholder="e.g. Grand Banquet Catering">
                </div>"""
                if old_company_block in content:
                    content = content.replace(old_company_block, gst_block)
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

    # Update .add-to-inquiry-btn styles to prevent black background / text issue
    old_btn_styles = """.add-to-inquiry-btn {
    background: none;
    border: 1px solid var(--primary-color);
    padding: 8px 16px;
    border-radius: 4px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition-smooth);
}

.add-to-inquiry-btn:hover {
    background: var(--primary-color);
    color: #fff;
}"""

    new_btn_styles = """.add-to-inquiry-btn {
    background: none;
    border: 1px solid var(--primary-gold);
    color: var(--text-dark);
    padding: 8px 16px;
    border-radius: 4px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition-smooth);
}

.add-to-inquiry-btn:hover {
    background: var(--primary-gold);
    color: #0a1812;
    border-color: var(--primary-gold);
}"""

    if old_btn_styles in content:
        content = content.replace(old_btn_styles, new_btn_styles)
        modified = True
    else:
        # Fallback regex replace
        pattern = re.compile(r'\.add-to-inquiry-btn\s*\{.*?\}.*?\.add-to-inquiry-btn:hover\s*\{.*?\}', re.DOTALL)
        if pattern.search(content):
            content = pattern.sub(new_btn_styles, content)
            modified = True

    # Update .range-val to fixed width of 65px and centered text
    old_range_val = """.range-val {
    font-weight: 700;
    background: var(--bg-white);
    padding: 5px 12px;
    border-radius: 4px;
    border: 1px solid var(--border-color);
}"""

    new_range_val = """.range-val {
    font-weight: 700;
    background: var(--bg-white);
    padding: 5px 0;
    width: 65px;
    text-align: center;
    border-radius: 4px;
    border: 1px solid var(--border-color);
}"""

    if old_range_val in content:
        content = content.replace(old_range_val, new_range_val)
        modified = True
    else:
        pattern = re.compile(r'\.range-val\s*\{.*?\}', re.DOTALL)
        if pattern.search(content):
            content = pattern.sub(new_range_val, content)
            modified = True

    if modified:
        with open(css_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Modified CSS: updated Add to Inquiry button & range-val width")

if __name__ == '__main__':
    modify_html_files()
    modify_css()
