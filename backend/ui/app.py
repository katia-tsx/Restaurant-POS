"""NiceGUI app mount.
Author: Johan
Version: 1.0.0
"""
from nicegui import ui


def register_ui() -> None:
    """Register lightweight dashboard UI."""
    ui.add_head_html('<style>body{font-family:Inter,sans-serif;background:#0F0F1A;color:#fff} .card:hover{transform:translateY(-2px);transition:all .2s ease;box-shadow:0 12px 24px rgba(0,0,0,.25)}</style>')

    @ui.page('/ui')
    def dashboard() -> None:
        ui.label('POS Restaurante').style('font-size:32px;font-weight:700;color:#6C63FF')
        with ui.row().classes('gap-4'):
            for title, value in [('Ventas hoy', '$ --'), ('Pedidos activos', '--'), ('Mesas', '--'), ('Ticket promedio', '$ --')]:
                with ui.card().classes('card p-4'):
                    ui.label(title).style('color:#cfcfe6')
                    ui.label(value).style('font-size:22px;font-weight:700')
