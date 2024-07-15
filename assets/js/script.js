
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
    const ultimosdiez = data_divisa.serie.slice(-10);
    const fechas = ultimosdiez.map((moneda) => moneda.fecha);
    const titulo = `${data_divisa.codigo}`;
    const colordelinea = 'green';
    const valores = ultimosdiez.map((moneda) => {
        const valor = moneda.valor;
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
        },

    }
    return config;

}

let miGrafico

async function renderGrafica() {
    const data_divisa = await getValorDivisa();
    const config = prepararConfig(data_divisa);
    const chartDOM = document.getElementById("myChart");  
    if (miGrafico) {
        miGrafico.destroy();

    } 
    miGrafico = new Chart(chartDOM, config); 
}
    