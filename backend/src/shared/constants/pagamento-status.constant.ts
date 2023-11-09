
export enum PagamentoStatusEnum {
    SOLICITADO = 'SOLICITADO',  // Pagamento solicitado
    EM_ANDAMENTO = 'EM_ANDAMENTO', // Pagamento em andamento
    PENDENTE = 'PENDENTE', // Pagamento pendente
    FALHA = 'FALHA', // Falha no pagamento
    PAGO_PARCIALMENTE = 'PAGO_PARCIALMENTE', // Pagamento realizado parcialmente
    ATRASADO = 'ATRASADO', // Pagamento atrasado
    AGUARDANDO_AUTORIZACAO = 'AGUARDANDO_AUTORIZACAO', // Aguardando autorização do pagamento
    AGUARDANDO_CONFIRMACAO = 'AGUARDANDO_CONFIRMACAO', // Aguardando confirmação do pagamento

    REJEITADO = 'REJEITADO', // Pagamento rejeitado
    CANCELADO = 'CANCELADO', // Pagamento cancelado
    CONCLUIDO = 'CONCLUIDO', // Pagamento concluído
}