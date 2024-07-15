
const boton =  document.querySelector('#btn-buscar')
const respuesta = document.querySelector('.respuesta')


async function getValorCLP() {
    
    try {
        const res = await fetch('https://mindicador.cl/api/')
        const data = res.json();

        return data;
    } catch (e) {
        let template = '';
        template += `
            <p class="fs-3 text-warning">Error: ${e.message}</p>
        `;
        respuesta.innerHTML = template;
    }
}

async function renderValor(monto, moneda) {
    let template = '';
    const data = await getValorCLP();
    let divisa
    let resultado;
    if (moneda=='euro') {
        divisa = data.euro.valor;
        valor = (monto/divisa).toFixed(2);
        resultado = ` Valor: € ${valor}`
    }
    else if (moneda=='dolar') {
        divisa = data.dolar.valor;
        valor = (monto/divisa).toFixed(2);
        resultado = `Valor: $ ${valor}`
    }
    else if (moneda=='uf') {
        divisa = data.uf.valor;
        valor = (monto/divisa).toFixed(2);
        resultado = `Valor: UF ${valor}`
    }
    
    template += `
        <p class="fs-3">${resultado}</p>
    `;
    respuesta.innerHTML = template;

    
} 


boton.addEventListener('click', () => {
    const monto = document.querySelector('.monto').value;
    const moneda = document.querySelector('.moneda').value;
    console.log(moneda)
    renderValor(monto, moneda);
    renderGrafica();
})

async function getValorDivisa() {

    const moneda = document.querySelector('.moneda').value;
    
    const res = await fetch(`https://mindicador.cl/api/${moneda}`)
    const data_divisa = res.json();

    return data_divisa;
   
}

function prepararConfig(data_divisa) {
    const tipodegrafica = 'line';
    const fechas = data_divisa.serie.map((fecha) => data_divisa.serie.fecha);
    const titulo = `${data_divisa.codigo}`;
    const colordelinea = 'green';
    const valores = data_divisa.serie.map((fecha) => {
        const valor = data_divisa.serie.valor;
        return Number(valor);
    });
    const config = {
        type: tipodegrafica,
        data: {
            labels: fechas,
            datasets: [
                {
                    label: titulo,
                    backgroundColor: colordelinea,
                    data: valores
                    }
            ]
        }
    }
    console.log(config);
    return config;

}

async function renderGrafica() {
    const data_divisa = await getValorDivisa();
    const config = prepararConfig(data_divisa);
    const chartDOM = document.getElementById("myChart");
    new Chart(chartDOM, config);
}
    