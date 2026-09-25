import fitz  # PyMuPDF
import os

pdf_path = "3-Temel EKG ve Ritim Bozuklukları.pdf"
output_dir = "public/ekg"
os.makedirs(output_dir, exist_ok=True)

# 1-indexed pages requested by user
target_pages = [4, 6, 7, 9, 10, 11, 14, 17, 18, 20, 22, 23, 24, 25, 26, 27, 28, 30, 32, 33, 34, 35, 36]

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
    image_list = page.get_images(full=True)
    
    if not image_list:
        print(f"No images found on page {page_num}.")
        continue
    
    largest_xref = None
    max_area = 0
    for img in image_list:
        xref = img[0]
        try:
            pix = fitz.Pixmap(doc, xref)
            area = pix.width * pix.height
            if area > max_area:
                max_area = area
                largest_xref = xref
            pix = None
        except Exception as e:
            print(f"Error processing image on page {page_num}: {e}")
            
    if largest_xref:
        try:
            pix = fitz.Pixmap(doc, largest_xref)
            # Convert CMYK to RGB if needed
            if pix.n - pix.alpha > 3:
                pix = fitz.Pixmap(fitz.csRGB, pix)
                
            output_path = os.path.join(output_dir, f"slide-{page_num}.png")
            pix.save(output_path)
            pix = None
            print(f"Saved image from page {page_num} to {output_path}")
        except Exception as e:
            print(f"Error saving image from page {page_num}: {e}")
    else:
        print(f"Could not extract image from page {page_num}.")
