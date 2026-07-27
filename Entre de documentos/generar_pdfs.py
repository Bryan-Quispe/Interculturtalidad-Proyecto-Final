from pathlib import Path

from pypdf import PdfWriter
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    PageBreak,
    Paragraph,
    Preformatted,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parent
PDF_DIR = ROOT / "pdf"
PDF_DIR.mkdir(exist_ok=True)
FONT_REGULAR = "Arial"
FONT_BOLD = "Arial-Bold"


def register_fonts() -> None:
    fonts_dir = Path("C:/Windows/Fonts")
    try:
        pdfmetrics.registerFont(TTFont(FONT_REGULAR, str(fonts_dir / "arial.ttf")))
        pdfmetrics.registerFont(TTFont(FONT_BOLD, str(fonts_dir / "arialbd.ttf")))
    except Exception:
        # Fall back to ReportLab built-ins if Windows fonts are unavailable.
        globals()["FONT_REGULAR"] = "Helvetica"
        globals()["FONT_BOLD"] = "Helvetica-Bold"


def clean_inline(text: str) -> str:
    text = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    text = text.replace("**", "")
    text = text.replace("`", "")
    return text


def split_table_line(line: str) -> list[str]:
    return [cell.strip() for cell in line.strip().strip("|").split("|")]


def add_table(lines: list[str], story: list, styles) -> None:
    rows = []
    for line in lines:
        cells = split_table_line(line)
        if all(set(cell) <= {"-", ":", " "} for cell in cells):
            continue
        rows.append([Paragraph(clean_inline(cell), styles["TableCell"]) for cell in cells])
    if not rows:
        return

    col_count = max(len(row) for row in rows)
    for row in rows:
        while len(row) < col_count:
            row.append(Paragraph("", styles["TableCell"]))

    available_width = A4[0] - 4 * cm
    col_widths = [available_width / col_count] * col_count
    table = Table(rows, colWidths=col_widths, repeatRows=1)
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#EAF2F8")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.HexColor("#1B2631")),
                ("GRID", (0, 0), (-1, -1), 0.25, colors.HexColor("#BFC9CA")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 4),
                ("RIGHTPADDING", (0, 0), (-1, -1), 4),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ]
        )
    )
    story.append(table)
    story.append(Spacer(1, 0.25 * cm))


def markdown_to_story(markdown: str, styles) -> list:
    story = []
    table_buffer: list[str] = []
    code_buffer: list[str] = []
    in_code = False

    def flush_table():
        nonlocal table_buffer
        if table_buffer:
            add_table(table_buffer, story, styles)
            table_buffer = []

    def flush_code():
        nonlocal code_buffer
        if code_buffer:
            story.append(Preformatted("\n".join(code_buffer), styles["DocCode"]))
            story.append(Spacer(1, 0.2 * cm))
            code_buffer = []

    for raw in markdown.splitlines():
        line = raw.rstrip()

        if line.startswith("```"):
            if in_code:
                flush_code()
                in_code = False
            else:
                flush_table()
                in_code = True
            continue

        if in_code:
            code_buffer.append(line)
            continue

        if line.startswith("|") and line.endswith("|"):
            table_buffer.append(line)
            continue
        flush_table()

        if not line.strip():
            story.append(Spacer(1, 0.12 * cm))
            continue

        if line.startswith("# "):
            story.append(Paragraph(clean_inline(line[2:]), styles["Title"]))
            story.append(Spacer(1, 0.25 * cm))
        elif line.startswith("## "):
            story.append(Paragraph(clean_inline(line[3:]), styles["Heading2"]))
        elif line.startswith("### "):
            story.append(Paragraph(clean_inline(line[4:]), styles["Heading3"]))
        elif line.startswith("- "):
            story.append(Paragraph("- " + clean_inline(line[2:]), styles["DocBullet"]))
        elif line[0:3].isdigit() and ". " in line[:5]:
            story.append(Paragraph(clean_inline(line), styles["Body"]))
        elif line.startswith("> "):
            story.append(Paragraph(clean_inline(line[2:]), styles["Quote"]))
        else:
            story.append(Paragraph(clean_inline(line), styles["Body"]))

    flush_table()
    flush_code()
    return story


def build_styles():
    register_fonts()
    styles = getSampleStyleSheet()
    styles.add(
        ParagraphStyle(
            "Body",
            parent=styles["BodyText"],
            fontName=FONT_REGULAR,
            fontSize=9.4,
            leading=12.4,
            spaceAfter=4,
        )
    )
    styles.add(
        ParagraphStyle(
            "DocBullet",
            parent=styles["Body"],
            leftIndent=12,
            firstLineIndent=-8,
        )
    )
    styles.add(
        ParagraphStyle(
            "Quote",
            parent=styles["Body"],
            leftIndent=12,
            textColor=colors.HexColor("#566573"),
        )
    )
    styles.add(
        ParagraphStyle(
            "TableCell",
            parent=styles["Body"],
            fontSize=7.2,
            leading=9.2,
            spaceAfter=0,
        )
    )
    styles.add(
        ParagraphStyle(
            "DocCode",
            parent=styles["Code"],
            fontName="Courier",
            fontSize=7.5,
            leading=9,
            leftIndent=6,
        )
    )
    styles["Title"].fontName = FONT_BOLD
    styles["Title"].fontSize = 17
    styles["Title"].leading = 21
    styles["Heading2"].fontName = FONT_BOLD
    styles["Heading2"].fontSize = 12
    styles["Heading2"].leading = 15
    styles["Heading2"].spaceBefore = 8
    styles["Heading2"].spaceAfter = 4
    styles["Heading3"].fontName = FONT_BOLD
    styles["Heading3"].fontSize = 10.5
    styles["Heading3"].leading = 13
    styles["Heading3"].spaceBefore = 6
    styles["Heading3"].spaceAfter = 3
    return styles


def footer(canvas, doc):
    canvas.saveState()
    register_fonts()
    canvas.setFont(FONT_REGULAR, 8)
    canvas.setFillColor(colors.HexColor("#566573"))
    canvas.drawString(2 * cm, 1.2 * cm, "Mascotas 3D - Documentacion Scrum")
    canvas.drawRightString(A4[0] - 2 * cm, 1.2 * cm, f"Pagina {doc.page}")
    canvas.restoreState()


def make_pdf(md_path: Path) -> Path:
    styles = build_styles()
    output = PDF_DIR / f"{md_path.stem}.pdf"
    doc = SimpleDocTemplate(
        str(output),
        pagesize=A4,
        leftMargin=2 * cm,
        rightMargin=2 * cm,
        topMargin=1.7 * cm,
        bottomMargin=1.8 * cm,
        title=md_path.stem,
        author="Proyecto Mascotas 3D",
    )
    story = markdown_to_story(md_path.read_text(encoding="utf-8"), styles)
    doc.build(story, onFirstPage=footer, onLaterPages=footer)
    return output


def main():
    md_files = sorted(
        path
        for path in ROOT.glob("*.md")
        if path.name != "README_ENTREGA.md"
    )
    readme = ROOT / "README_ENTREGA.md"
    if readme.exists():
        md_files.insert(0, readme)

    generated = [make_pdf(path) for path in md_files]

    writer = PdfWriter()
    for pdf in generated:
        for page in __import__("pypdf").PdfReader(str(pdf)).pages:
            writer.add_page(page)

    combined = PDF_DIR / "DOCUMENTACION_COMPLETA_MASCOTAS_3D_SCRUM.pdf"
    with combined.open("wb") as fh:
        writer.write(fh)

    print(f"Generados {len(generated)} PDFs individuales")
    print(combined)


if __name__ == "__main__":
    main()
