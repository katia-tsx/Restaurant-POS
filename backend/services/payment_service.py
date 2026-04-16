"""Lógica de pagos y cambio.
Autor: Kevin
Versión: 1.0.0
"""
import logging
from decimal import Decimal
from backend.models.order import OrderStatus
from backend.models.payment import Payment, PaymentMethod

logger = logging.getLogger(__name__)


class PaymentService:
    """Procesa pagos usando estrategia por método."""

    @staticmethod
    def process(payment: Payment, order_total: Decimal) -> Payment:
        """Calcula cambio y marca valores de pago."""
        if payment.method == PaymentMethod.cash.value and payment.received_amount is not None:
            payment.change_amount = (payment.received_amount - order_total).quantize(Decimal('0.01'))
        else:
            payment.change_amount = Decimal('0.00')
        logger.info("Pago procesado order_id=%s method=%s", payment.order_id, payment.method)
        return payment
