$(document).ready(function() {
    $('#cep').mask('00000-000');

    $('#btn-buscar-cep').click(function() {
        const cep = $('#cep').val().replace(/\D/g, '');
        if (cep.length !== 8) {
            alert('Por favor, digite um CEP válido com 8 dígitos.');
            return;
        }

        const endpoint = `https://viacep.com.br/ws/${cep}/json/`;
        const botao = $(this);

        botao.find('i').addClass('d-none');
        botao.find('span').removeClass('d-none');

        fetch(endpoint)
            .then(resposta => resposta.json())
            .then(json => {
                if (json.erro) {
                    alert('CEP não encontrado.');
                    $('#endereco').val('');
                    return;
                }
                const logradouro = json.logradouro || '';
                const bairro = json.bairro || '';
                const cidade = json.localidade || '';
                const estado = json.uf || '';
                const endereco = `${logradouro}, ${bairro} - ${cidade} - ${estado}`;
                $('#endereco').val(endereco);
            })
            .catch(() => {
                alert('Ocorreu um erro ao buscar o CEP.');
            })
            .finally(() => {
                botao.find('i').removeClass('d-none');
                botao.find('span').addClass('d-none');
            });
    });

    $('#formulario-pedido').submit(function(evento) {
        evento.preventDefault();

        const nome = $('#nome').val().trim();
        const sobrenome = $('input[placeholder="Sobrenome"]').val().trim();
        const email = $('input[placeholder="E-mail"]').val().trim();
        const cep = $('#cep').val().replace(/\D/g, '');
        const endereco = $('#endereco').val().trim();
        const numero = $('input[placeholder="Número"]').val().trim();

        if (nome.length === 0) {
            alert('Por favor, digite o nome.');
            $('#nome').focus();
            return;
        }

        if (sobrenome.length === 0) {
            alert('Por favor, digite o sobrenome.');
            $('input[placeholder="Sobrenome"]').focus();
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email.length === 0) {
            alert('Por favor, digite o e-mail.');
            $('input[placeholder="E-mail"]').focus();
            return;
        } else if (!emailRegex.test(email)) {
            alert('Por favor, digite um e-mail válido.');
            $('input[placeholder="E-mail"]').focus();
            return;
        }

        if (cep.length !== 8) {
            alert('Por favor, digite um CEP válido com 8 dígitos.');
            $('#cep').focus();
            return;
        }

        if (endereco.length === 0) {
            alert('Por favor, preencha o endereço.');
            $('#endereco').focus();
            return;
        }

        if (numero.length === 0) {
            alert('Por favor, digite o número.');
            $('input[placeholder="Número"]').focus();
            return;
        }

        const numeroInt = parseInt(numero, 10);
        if (isNaN(numeroInt) || numeroInt <= 0) {
            alert('Por favor, digite um número válido maior que zero.');
            $('input[placeholder="Número"]').focus();
            return;
        }


        $(this).off('submit');
        $(this).submit();
    });
});
