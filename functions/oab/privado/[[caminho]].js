// A pasta privada nunca é servida diretamente: o conteúdo só sai pela função /oab/conteudo/, depois do login.
export const onRequest = () => new Response('Não encontrado', { status: 404 });
