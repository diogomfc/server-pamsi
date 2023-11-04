// Expressão regular para CEP no formato "00000-000"
const cepRegex = /^\d{5}-\d{3}$/;

// Expressão regular para telefone no formato "(00) 0000-0000"
const telefoneRegex = /^\(\d{2}\) \d{4}-\d{4}$/;

// Expressão regular para celular no formato "(00) 00000-0000"
const celularRegex = /^\(\d{2}\) \d{5}-\d{4}$/;

// Expressão regular para CPF no formato "000.000.000-00"
const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

// Expressão regular para CNPJ no formato "00.000.000/0000-00"
const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;

export const Regex = {
    cep: cepRegex,
    telefone: telefoneRegex,
    celular: celularRegex,
    cpf: cpfRegex,
    cnpj: cnpjRegex,
};