import fitz  # PyMuPDF
import os

pdf_path = "3-Temel EKG ve Ritim Bozuklukları.pdf"
output_dir = "public/ekg"
os.makedirs(output_dir, exist_ok=True)

# 1-indexed pages requested by user
target_pages = [17, 18, 22, 23, 25, 26, 30, 32, 33, 34, 35, 36]

try:
    doc = fitz.open(pdf_path)
    print(f"PDF opened successfully. Total pages: {len(doc)}")
except Exception as e:
    print(f"Error opening PDF: {e}")
    exit(1)

for page_num in target_pages:
    # 0-indexed
    p = page_num - 1
    if p < 0 or p >= len(doc):
        print(f"Page {page_num} is out of range.")
        continue
    
    page = doc[p]
    
    # Calculate clipping rect: x0=0, y0=40, x1=width, y1=height * 0.55
    rect = page.rect
    clip = fitz.Rect(0, 40, rect.width, rect.height * 0.55)
    
    try:
        pix = page.get_pixmap(dpi=200, clip=clip)
        
        output_path = os.path.join(output_dir, f"slide-{page_num}.png")
        pix.save(output_path)
        pix = None
        print(f"Saved rendered image from page {page_num} to {output_path}")
    except Exception as e:
        print(f"Error saving rendered image from page {page_num}: {e}")
