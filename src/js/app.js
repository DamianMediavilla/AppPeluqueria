let pagina=1;
const cita={
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}
document.addEventListener('DOMContentLoaded', function(){
    iniciarApp();
});

function iniciarApp(){
    mostrarServicios();
    //resalta div actiual
    mostrarSeccion();
    //oculta o muestra secciones
    cambiarSeccion();

    paginaSiguiente();
    paginaAnterior();
    botonesPaginador();
    mostrarResumen();
    nombreCita();
    fechaCita();
    deshabilitarFechaAnterior();
    horaCita();

}

function mostrarSeccion(){
    const seccionAnterior= document.querySelector(".mostrar-seccion");
    if  (seccionAnterior){
        seccionAnterior.classList.remove('mostrar-seccion');   
    }
    const tabAnterior=document.querySelector(".tabs .actual");
    if(tabAnterior){
        tabAnterior.classList.remove('actual');
    }

    const seleccionActual = document.querySelector(`#paso-${pagina}`);
    seleccionActual.classList.add("mostrar-seccion");

    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual');

}

function cambiarSeccion(){
    const enlaces = document.querySelectorAll('.tabs button');
    enlaces.forEach(enlace=>{
        enlace.addEventListener('click', e=>{
            e.preventDefault();
            pagina = parseInt(e.target.dataset.paso);
            console.log(pagina);
            mostrarSeccion();
            botonesPaginador();


        })
    })
}

async function mostrarServicios(){
    try {
        const resultado= await fetch('./servicios.json')  
        const db = await resultado.json();
        //const servicios = db.servicios;
        const {servicios} =db;
        //console.log(servicios);
        servicios.forEach(servicio =>{
            //console.log(servicio);
            const { id, nombre, precio} = servicio;
            //DOM
            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');
            //console.log(nombreServicio);
            //DOM
            /* const idServicio = document.createElement('P');
            idServicio.textContent = id;
            idServicio.classList.add('id-servicio'); */
            //console.log(idServicio);
            //DOM
            const precioServicio = document.createElement('P');
            precioServicio.textContent = `$ ${precio}`;
            precioServicio.classList.add('precio-servicio');
            //console.log(precioServicio);

            const servicioDiv = document.createElement('DIV');
            servicioDiv.classList.add('servicio');
            servicioDiv.dataset.id = id;
            
            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);
            
            servicioDiv.onclick = seleccionarServicio;
            document.querySelector('#servicios').appendChild(servicioDiv);

        })
    } catch (error) {
        console.log(error);
    }
}

function seleccionarServicio(e){
    //console.log(e.target.dataset.id);
    let elemento;
    if(e.target.tagName === 'P'){
        elemento = e.target.parentElement; 
        //console.log('true');
    }else{
        elemento = e.target;
        //console.log('false');
 
    }
    console.log(elemento.dataset.id);
    if (elemento.classList.contains('seleccionado')){
        elemento.classList.remove('seleccionado');
        //const id = parseInt(elemento.dataset.id);
        eliminaServicio(parseInt(elemento.dataset.id));
    }else{
        elemento.classList.add('seleccionado');
        
        const servicioObj = {
            id: parseInt(elemento.dataset.id),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent
            
        }
         
        agregaServicio(servicioObj);
    }
}

function eliminaServicio(elementId){
    const {servicios}=cita;
    cita.servicios= servicios.filter(servicio=>servicio.id !== elementId);
    console.log(cita.servicios); 
    
}

function agregaServicio(servicioObj){
    const {servicios}=cita;
    cita.servicios=[...servicios, servicioObj];
    
    console.log(cita.servicios); 
    
}


function paginaAnterior(){
    const paginaAnterior = document.querySelector(`#anterior`);
    paginaAnterior.addEventListener('click', () => {
        pagina--;
        botonesPaginador();
    });
}

function paginaSiguiente(){
    const paginaSiguiente = document.querySelector(`#siguiente`);
    paginaSiguiente.addEventListener('click', () => {
        pagina++;
        botonesPaginador();
    });
    
    
}

function botonesPaginador(){
    const paginaAnterior = document.querySelector(`#anterior`);
    const paginaSiguiente = document.querySelector(`#siguiente`);
    
    if(pagina===1){
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }else if (pagina===3){
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.add('ocultar');
        mostrarResumen();
    }else{
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
        
        
    }
    mostrarSeccion();
}

function mostrarResumen(){
    const { nombre, fecha, hora, servicios }=cita;

    const resumenDiv=document.querySelector('.contenido-resumen');

    //limpiar html
    //resumenDiv.innerHTML = ''; //Funcionaria de la misma manera, pero consume muchos mas recursos
    while(resumenDiv.firstChild){
        resumenDiv.removeChild(resumenDiv.firstChild);
        console.log('while');
    }

    if (Object.values(cita).includes('')){
        const noServicios = document.createElement('P');
        noServicios.textContent=  "Faltan datos de servicios, Hora Fecha o Nombre";
        noServicios.classList.add('invalidar-cita');
        resumenDiv.appendChild(noServicios);
        console.log(cita);
        
    } else{
        const headingCita=document.createElement('H3');
        headingCita.textContent='Resumen de la Cita';
        resumenDiv.appendChild(headingCita)

        const nombreCita= document.createElement('P');
        //nombreCita.textContent=`<span>Nombre:</span> ${nombre}`; //trata todo como texto
        nombreCita.innerHTML=`<span>Nombre:</span> ${nombre}`; //Trata <span> como etiqueta
        resumenDiv.appendChild(nombreCita);
        

        const fechaCita= document.createElement('P');
        fechaCita.innerHTML=`<span>Fecha:</span> ${fecha}`; //Trata <span> como etiqueta
        resumenDiv.appendChild(fechaCita);

        const horaCita= document.createElement('P');
        horaCita.innerHTML=`<span>Hora:</span> ${hora}`; //Trata <span> como etiqueta
        resumenDiv.appendChild(horaCita);

        const headingServicios=document.createElement('H3');
        headingServicios.textContent='Resumen Servicios';
        resumenDiv.appendChild(headingServicios)

        const serviciosCita = document.createElement('DIV');
        serviciosCita.classList.add('resumen-servicios');

        let costoTotal =0;

        servicios.forEach( servicio => {
            const contenedorServicio = document.createElement('DIV');
            contenedorServicio.classList.add('contenedor-servicio');
            const textoServicio =document.createElement('P');
            textoServicio.textContent=servicio.nombre;
            const precioServicio =document.createElement('P');
            precioServicio.textContent=servicio.precio;
            precioServicio.classList.add('precio');
            contenedorServicio.appendChild(textoServicio);
            contenedorServicio.appendChild(precioServicio);
            serviciosCita.appendChild(contenedorServicio); //
            
            const totalServicio = servicio.precio.split('$');
            costoTotal += parseInt(totalServicio[1].trim());
             
        })
        
        resumenDiv.appendChild(serviciosCita);

        const cantPagar = document.createElement('P');
        cantPagar.innerHTML = `<span>Cantidad a Pagar:<span> $ ${costoTotal}`
        cantPagar.classList.add('total');
        resumenDiv.appendChild(cantPagar);

    }
}

function nombreCita(){
    const nombreInput = document.querySelector('#nombre');
    nombreInput.addEventListener('input',e=>{
        const nombreTexto=e.target.value.trim();
        if (nombreTexto===''){
            mostrarAlerta('Nombre no valido', 'error');
            
        }else{
            cita.nombre=nombreTexto;
            const alerta=document.querySelector('.alerta');
            if(alerta){
                alerta.remove();
            }
        }
        console.log(e.target.value);
    })
}
function mostrarAlerta(mensaje, tipo){
    const alertaPrevia=document.querySelector('.alerta');
    if  (alertaPrevia){
        return;
       //alertaPrevia.remove();
    }
    const alerta= document.createElement('DIV');
    alerta.textContent = mensaje;
    console.log(mensaje);
    alerta.classList.add('alerta');
    if (tipo === 'error'){
        alerta.classList.add('error')
    }
    const formulario = document.querySelector('.formulario');
    formulario.appendChild(alerta);
    setTimeout(()=>{
        alerta.remove();
    }, 2000);
    
} 
function fechaCita(){
    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener('input', e=>{
        const dia = new Date(e.target.value).getUTCDay(); //formato numerico del dia de la semana del 0 al 6
        console.log(dia);
        /* const opciones ={
            day: 'numeric',
            weekday: 'long',
            year: 'numeric',
            month: 'long'
        }
        console.log(dia.toLocaleDateString('es-ES', opciones)); */
        if ([0].includes(dia)){ //0 corresponde a domingo, 1lun.... 6Sab
            e.preventDefault();
            fechaInput.value='';
            mostrarAlerta('Cerrado los fines de semana','error');
        }else{
            cita.fecha=fechaInput.value;


        }
    }) 
}
function horaCita(){
    const horaInput= document.querySelector('#hora');
    horaInput.addEventListener('input', e=>{
        const horaCita = e.target.value;
        const hora= horaCita.split(':');
        if(hora[0]<9||hora[0]>15){
            mostrarAlerta('Ese horario no es valido','error');
           /*  setTimeout(() => {
                horaInput.value='';

                
            }, 2000); */
            return;
        }
        cita.hora=horaInput.value;

    })
}

function deshabilitarFechaAnterior(){
    const inputFecha = document.querySelector('#fecha');
    const fechaAhora = new Date();
    const dia = fechaAhora.getDate() +1; //da la fecha El +1 es para deshabilitar tambien el dia actual
    const year =fechaAhora.getFullYear(); //da el año
    const mes =fechaAhora.getMonth() +1; //da el mes (inicia como un arrat, 0=enero 11=Dic)

    const fechaDeshabilitar = `${year}-${dia}-${mes}`;
    inputFecha.min = fechaDeshabilitar;
    console.log(fechaDeshabilitar);
}
