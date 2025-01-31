import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../out.css';


const Queja = () => {

    
    const navigate = useNavigate();
    const [pagina,setpagina]=useState(0)


    const sexo=['Femenino','Masculino']
    const estamento=['Estudiante','Docente','Funcionario',
        'Externo','Usuario de las instalaciones']
    const sino=['Si','No']
    const identidad_genero_opt=['Cisgénero','Transgénero',
        'No binario', 'Género fluido', 'Otro'
    ]
    const orientacion_sexual_opt=['Heterosexual','Homosexual',
        'Bisexual','Pansexual','Asexual','Queer','Demisexual',
        'Otro'
    ]
    const tipoVBG_opt=['Economica','Sexual','Fisica']
    const condicion_etnica=['Indígena','Negro(a)','Mulato']
    const facultades=[ 
        'Artes Integradas',
        'Ciencias Naturales y Exactas',
        'Ciencias de la Administración',
        'Salud',
        'Ciencias Sociales y Económicas',
        'Humanidades',
        'Ingeniería',
        'Educación y Pedagogía',
        'Psicología',
        'Derecho y Ciencia Política',
    ]
    const sedes= ['Melendez','San Fernando','Buga',
        'Caicedonia','Cartago','Norte del Cauca',
        'Pacífico','Pacífico','Palmira','Tuluá',
        'Yumbo','Zazal',]


    const [persona_que_reporta, set_persona_que_reporta]=useState(
        {
        'fecha_recepcion':'2024-06-00',
        'reporta_nombre':'',
        'reporta_sexo' : '',
        'reporta_edad': '',
        'reporta_estamento':'',
        'reporta_vicerrectoria_adscrito':'',
        'reporta_dependencia':'',
        'reporta_programa_academico':'',
        'reporta_facultad':'',
        'reporta_sede':'',
        'reporta_celular':'',
        'reporta_correo':'',
        })
    const [datos_afectado,set_datos_afectado]=useState({
        'afectado_nombre':'',
        'afectado_sexo':'',
        'afectado_edad':'',
        'afectado_comuna':'',
        'afectado_estrato_socioeconomico':'',
        'afectado_condicion_etnico_racial':'',
        'afectado_tiene_discapacidad':'',
        'afectado_tipo_discapacidad':'',
        'afectado_identidad_genero':'',
        'afectado_orientacion_sexual':'',
        'afectado_estamento':'',
        'afectado_vicerrectoria_adscrito':'',
        'afectado_dependencia':'',
        'afectado_programa_academico':'',
        'afectado_facultad':'',
        'afectado_sede':'',
        'afectado_celular':'',
        'afectado_correo':'',
        'afectado_tipo_vbg_os':'',
        'afectado_detalles_caso':'',
        })
    const [datos_agresor,set_datos_agresor]=useState({
        'agresor_nombre':'',
        'agresor_sexo':'',
        'agresor_edad':'',
        'agresor_condicion_etnico_racial':'',
        'agresor_tiene_discapacidad':'',
        'agresor_tipo_discapacidad':'',
        'agresor_identidad_genero':'',
        'agresor_orientacion_sexual':'',
        'agresor_estamento':'',
        'agresor_vicerrectoria_adscrito':'',
        'agresor_dependencia':'',
        'agresor_programa_academico':'',
        'agresor_facultad':'',
        'agresor_sede':'',
        })
    const [datos_adicionales,set_datos_adicionales]=useState(
        {
            'desea_activar_ruta_atencion_integral':'',
            'recibir_asesoria_orientacion_sociopedagogica':'',
            'orientacion_psicologica':'',
            'asistencia_juridica':'',
            'acompañamiento_solicitud_medidas_proteccion_inicial':'',
            'acompañamiento_ante_instancias_gubernamentales':'',
            'interponer_queja_al_comite_asusntos_internos_disciplinarios':'',
            'observaciones':'',
            })


    const onchange = (func,field,value) =>{
        func((prevState)=>({
            ...prevState,
            [field]: value,
        }));
    }

    const previousPage=()=>{
        if(pagina<1){
            setpagina(0)
        }else{
            setpagina(pagina-1)
        }
    }

    const nextPage = ()=>{
        
        if(pagina>=2){
            setpagina(3)
        }else{
            setpagina(pagina+1)
        }
    }

    const sendform = async ()=>{
        const fecha = new Date();
        const fechaFormateada = `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;

        onchange(set_persona_que_reporta,"fecha_recepcion",fechaFormateada)
        
        const newform = {...persona_que_reporta, ...datos_afectado, ...datos_agresor,...datos_adicionales}
        console.log(newform)


        
    try {
        const response = await fetch('http://localhost:8000/api/quejas/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newform),
        });
    
        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error detallado en la respuesta:", errorData);
        }
    
      } catch (error) {
        console.log('No fue posible conectarse con el servidos')
      }




        //navigate('/')
    }


  return (
  
    <div className="App">
      <header className="App-header-light">

        <div className='default-container'>
            <div>
            {pagina===0&&(<>
            <h1>Datos de la persona que reporta el caso de VBG</h1>
            <div className='form-container'>
                <div>
                <p>Nombre</p>
                

                <input value={persona_que_reporta.reporta_nombre} onChange={(e)=>onchange(set_persona_que_reporta,"reporta_nombre",e.target.value)}></input>
                <p>Sexo</p>
                <select value={persona_que_reporta.reporta_sexo} 
                onChange={(e) => onchange(set_persona_que_reporta,"reporta_sexo",e.target.value)} >
                    <option>-------------------------------------------------------------------</option>
                    {sexo.map((option,index)=>(
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                <p>Edad</p>
                <input value={persona_que_reporta.reporta_edad} onChange={(e)=>onchange(set_persona_que_reporta,"reporta_edad",e.target.value)}></input>
                <p>Estamento de la persona que reporta</p>

                <select value={persona_que_reporta.reporta_estamento} 
                onChange={(e) => onchange(set_persona_que_reporta,"reporta_estamento",e.target.value)} >
                    <option>-------------------------------------------------------------------</option>
                    {estamento.map((option,index)=>(
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>


                <p>Vicerrectoría a la que está adscrito(a)</p>
                <input value={persona_que_reporta.reporta_vicerrectoria_adscrito} onChange={(e)=>onchange(set_persona_que_reporta,"reporta_vicerrectoria_adscrito",e.target.value)}></input>
                <p>Dependencia</p>
                <input value={persona_que_reporta.reporta_dependencia} onChange={(e)=>onchange(set_persona_que_reporta,"reporta_dependencia",e.target.value)}></input>
                </div>
                <div>
                <p>Facultad</p>
                

                <select value={persona_que_reporta.reporta_facultad} 
                onChange={(e) => onchange(set_persona_que_reporta,"reporta_facultad",e.target.value)} >
                    <option>-------------------------------------------------------------------</option>
                    {facultades.map((option,index)=>(
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                



                <p>Programa Académico</p>
                <input value={persona_que_reporta.reporta_programa_academico} onChange={(e)=>onchange(set_persona_que_reporta,"reporta_programa_academico",e.target.value)}></input>
                
                <p>Sede</p>
                <select value={persona_que_reporta.reporta_sede} 
                onChange={(e) => onchange(set_persona_que_reporta,"reporta_sede",e.target.value)} >
                    <option>-------------------------------------------------------------------</option>
                    {sedes.map((option,index)=>(
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                <p>Celular</p>
                <input value={persona_que_reporta.reporta_celular} onChange={(e)=>onchange(set_persona_que_reporta,"reporta_celular",e.target.value)}></input>
                <p>Correo</p>
                <input value={persona_que_reporta.reporta_correo} onChange={(e)=>onchange(set_persona_que_reporta,"reporta_correo",e.target.value)}></input>
                </div>
            </div>
            
            </>)}
            {pagina===1&&(<>
            <h1>Datos de la persona afectada</h1>
            <div className='form-container'>
            <div>
            <p>Nombre</p>
            <input value={datos_afectado.afectado_nombre} onChange={(e)=>onchange(set_datos_afectado,"afectado_nombre",e.target.value)}></input>
            <p>Sexo</p>
            <select value={datos_afectado.afectado_sexo} 
                onChange={(e) => onchange(set_datos_afectado,"afectado_sexo",e.target.value)} >
                    <option>-------------------------------------------------------------------</option>
                    {sexo.map((option,index)=>(
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            <p>Edad</p>
            <input value={datos_afectado.afectado_edad} onChange={(e)=>onchange(set_datos_afectado,"afectado_edad",e.target.value)}></input>
            <p>Comunda donde reside</p>
            <input value={datos_afectado.afectado_comuna} onChange={(e)=>onchange(set_datos_afectado,"afectado_comuna",e.target.value)}></input>
            <p>Estrato socioeconónmico</p>
            <input value={datos_afectado.afectado_estrato_socioeconomico} onChange={(e)=>onchange(set_datos_afectado,"afectado_estrato_socioeconomico",e.target.value)}></input>
            <p>Condición etnico racial</p>
            <select value={datos_afectado.afectado_condicion_etnico_racial} 
                onChange={(e) => onchange(set_datos_afectado,"afectado_condicion_etnico_racial",e.target.value)} >
                    <option>-------------------------------------------------------------------</option>
                    {condicion_etnica.map((option,index)=>(
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            
            <p>¿Tiene algún tipo de discapacidad?</p>
            <select value={datos_afectado.afectado_tiene_discapacidad} 
                onChange={(e) => onchange(set_datos_afectado,"afectado_tiene_discapacidad",e.target.value)} >
                    <option>-------------------------------------------------------------------</option>
                    {sino.map((option,index)=>(
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            <p>Tipo de discapacidad</p>
            <input value={datos_afectado.afectado_tipo_discapacidad} onChange={(e)=>onchange(set_datos_afectado,"afectado_tipo_discapacidad",e.target.value)}></input>
            <p>Identidad de género</p>
            <select value={datos_afectado.afectado_identidad_genero} 
                onChange={(e) => onchange(set_datos_afectado,"afectado_identidad_genero",e.target.value)} >
                    <option>-------------------------------------------------------------------</option>
                    {identidad_genero_opt.map((option,index)=>(
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            <p>Orientación sexual</p>
            <select value={datos_afectado.afectado_orientacion_sexual} 
                onChange={(e) => onchange(set_datos_afectado,"afectado_orientacion_sexual",e.target.value)} >
                    <option>-------------------------------------------------------------------</option>
                    {orientacion_sexual_opt.map((option,index)=>(
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            
            </div>
            <div>
            <p>Estamento de la persona afectada</p>
            <select value={datos_afectado.afectado_estamento} 
                onChange={(e) => onchange(set_datos_afectado,"afectado_estamento",e.target.value)} >
                    <option>-------------------------------------------------------------------</option>
                    {estamento.map((option,index)=>(
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>

            <p>Vicerrectoria a la que está adscrito(a)</p>
            <input value={datos_afectado.afectado_vicerrectoria_adscrito} onChange={(e)=>onchange(set_datos_afectado,"afectado_vicerrectoria_adscrito",e.target.value)}></input>
            <p>Dependencia</p>
            <input value={datos_afectado.afectado_dependencia} onChange={(e)=>onchange(set_datos_afectado,"afectado_dependencia",e.target.value)}></input>
            <p>Facultad</p>
            <select value={datos_afectado.afectado_facultad} 
                onChange={(e) => onchange(set_datos_afectado,"afectado_facultad",e.target.value)} >
                    <option>-------------------------------------------------------------------</option>
                    {facultades.map((option,index)=>(
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            <p>Programa Académico</p>
            <input value={datos_afectado.afectado_programa_academico} onChange={(e)=>onchange(set_datos_afectado,"afectado_programa_academico",e.target.value)}></input>
            <p>sede</p>
            <select value={datos_afectado.afectado_sede} 
                onChange={(e) => onchange(set_datos_afectado,"afectado_sede",e.target.value)} >
                    <option>-------------------------------------------------------------------</option>
                    {sedes.map((option,index)=>(
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            <p>Celular</p>
            <input value={datos_afectado.afectado_celular} onChange={(e)=>onchange(set_datos_afectado,"afectado_celular",e.target.value)}></input>
            <p>Correo</p>
            <input value={datos_afectado.afectado_correo} onChange={(e)=>onchange(set_datos_afectado,"afectado_correo",e.target.value)}></input>
            <p>Tipo de violencia basada en género u orientación sexual</p>
            <select value={datos_afectado.afectado_tipo_vbg_os} 
                onChange={(e) => onchange(set_datos_afectado,"afectado_tipo_vbg_os",e.target.value)} >
                    <option>-------------------------------------------------------------------</option>
                    {tipoVBG_opt.map((option,index)=>(
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            <p>Detalle del caso VBG</p>
            <input value={datos_afectado.afectado_detalles_caso} onChange={(e)=>onchange(set_datos_afectado,"afectado_detalles_caso",e.target.value)}></input>
            </div>

            </div>
            
            </>)}
            {pagina===2&&(<>
            <h1>Datos de la persona agresora</h1>

            <div className='form-container'>
            <div>
            <p>Nombre</p>
            <input value={datos_agresor.agresor_nombre} onChange={(e)=>onchange(set_datos_agresor,"agresor_nombre",e.target.value)}></input>
            <p>Sexo</p>
            <select value={datos_agresor.agresor_sexo} 
                onChange={(e) => onchange(set_datos_agresor,"agresor_sexo",e.target.value)} >
                    <option>-------------------------------------------------------------------</option>
                    {sexo.map((option,index)=>(
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>


            <p>Edad</p>
            <input value={datos_agresor.agresor_edad} onChange={(e)=>onchange(set_datos_agresor,"agresor_edad",e.target.value)}></input>
            <p>Condición etnico racial</p>
            <select value={datos_agresor.agresor_condicion_etnico_racial} 
                onChange={(e) => onchange(set_datos_agresor,"agresor_condicion_etnico_racial",e.target.value)} >
                    <option>-------------------------------------------------------------------</option>
                    {condicion_etnica.map((option,index)=>(
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>

            <p>¿Tiene algún tipo de discapacidad?</p>
            <select value={datos_agresor.agresor_tiene_discapacidad} 
                onChange={(e) => onchange(set_datos_agresor,"agresor_tiene_discapacidad",e.target.value)} >
                    <option>-------------------------------------------------------------------</option>
                    {sino.map((option,index)=>(
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            <p>Tipo de discapacidad</p>
            <input value={datos_agresor.agresor_tipo_discapacidad} onChange={(e)=>onchange(set_datos_agresor,"agresor_tipo_discapacidad",e.target.value)}></input>
            <p>Identidad de género</p>
            <select value={datos_agresor.agresor_identidad_genero} 
                onChange={(e) => onchange(set_datos_agresor,"agresor_identidad_genero",e.target.value)} >
                    <option>-------------------------------------------------------------------</option>
                    {identidad_genero_opt.map((option,index)=>(
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>
            <div>
            <p>Orientación sexual</p>
            <select value={datos_agresor.agresor_orientacion_sexual} 
                onChange={(e) => onchange(set_datos_agresor,"agresor_orientacion_sexual",e.target.value)} >
                    <option>-------------------------------------------------------------------</option>
                    {orientacion_sexual_opt.map((option,index)=>(
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            <p>Estamento de la persona agresora</p>
            <select value={datos_agresor.agresor_estamento} 
                onChange={(e) => onchange(set_datos_agresor,"agresor_estamento",e.target.value)} >
                    <option>-------------------------------------------------------------------</option>
                    {estamento.map((option,index)=>(
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>

            <p>Vicerrectoria a la que está adscrito(a)</p>
            <input value={datos_agresor.agresor_vicerrectoria_adscrito} onChange={(e)=>onchange(set_datos_agresor,"agresor_vicerrectoria_adscrito",e.target.value)}></input>
            <p>Dependencia</p>
            <input value={datos_agresor.agresor_dependencia} onChange={(e)=>onchange(set_datos_agresor,"agresor_dependencia",e.target.value)}></input>
            <p>Programa Académico</p>
            <input value={datos_agresor.agresor_programa_academico} onChange={(e)=>onchange(set_datos_agresor,"agresor_programa_academico",e.target.value)}></input>
            <p>Facultad</p>
            <select value={datos_agresor.agresor_facultad} 
                onChange={(e) => onchange(set_datos_agresor,"agresor_facultad",e.target.value)} >
                    <option>-------------------------------------------------------------------</option>
                    {facultades.map((option,index)=>(
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            <p>sede</p>
            <select value={datos_agresor.agresor_sede} 
                onChange={(e) => onchange(set_datos_agresor,"agresor_sede",e.target.value)} >
                    <option>-------------------------------------------------------------------</option>
                    {sedes.map((option,index)=>(
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>
            </div>
            
            </>)}



            {pagina===3&&(<>
            <div className='form-container'>
            <div>
            <p>Desea activar la ruta de atencion integral</p>
            <select value={datos_adicionales.desea_activar_ruta_atencion_integral} 
                onChange={(e) => onchange(set_datos_adicionales,"desea_activar_ruta_atencion_integral",e.target.value)} >
                    <option>-------------------------------------------------------------------</option>
                    {sino.map((option,index)=>(
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            <p>¿Requiere recibir asesoría y orientacion socio-pedagógica?</p>
            <select value={datos_adicionales.recibir_asesoria_orientacion_sociopedagogica} 
                onChange={(e) => onchange(set_datos_adicionales,"recibir_asesoria_orientacion_sociopedagogica",e.target.value)} >
                    <option>-------------------------------------------------------------------</option>
                    {sino.map((option,index)=>(
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>

            <p>¿Requiere recibir orientación psicológica?</p>
            <select value={datos_adicionales.orientacion_psicologica} 
                onChange={(e) => onchange(set_datos_adicionales,"orientacion_psicologica",e.target.value)} >
                    <option>-------------------------------------------------------------------</option>
                    {sino.map((option,index)=>(
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            <p>¿Requiere recibir asistencia jurídica?</p>
            <select value={datos_adicionales.asistencia_juridica} 
                onChange={(e) => onchange(set_datos_adicionales,"asistencia_juridica",e.target.value)} >
                    <option>-------------------------------------------------------------------</option>
                    {sino.map((option,index)=>(
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>
            <div>
            <p>¿Requiere recibir acompañamiento para solicitud de medidas de protección inicial?</p>
            <select value={datos_adicionales.acompañamiento_solicitud_medidas_proteccion_inicial} 
                onChange={(e) => onchange(set_datos_adicionales,"acompañamiento_solicitud_medidas_proteccion_inicial",e.target.value)} >
                    <option>-------------------------------------------------------------------</option>
                    {sino.map((option,index)=>(
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            <p>¿Requiere recibir acompañamiento ante instancias gubernamentales?</p>
            <select value={datos_adicionales.acompañamiento_ante_instancias_gubernamentales} 
                onChange={(e) => onchange(set_datos_adicionales,"acompañamiento_ante_instancias_gubernamentales",e.target.value)} >
                    <option>-------------------------------------------------------------------</option>
                    {sino.map((option,index)=>(
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            <p>¿Requiere interponer una queja formal al Comité De Asuntos Internos Disciplinarios?</p>
            <select value={datos_adicionales.interponer_queja_al_comite_asusntos_internos_disciplinarios} 
                onChange={(e) => onchange(set_datos_adicionales,"interponer_queja_al_comite_asusntos_internos_disciplinarios",e.target.value)} >
                    <option>-------------------------------------------------------------------</option>
                    {sino.map((option,index)=>(
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            <p>Observaciones</p>
            <input value={datos_adicionales.observaciones} onChange={(e)=>onchange(set_datos_adicionales,"observaciones",e.target.value)}></input>
            </div>
            </div>
            

            
            </>)}
            </div>
            
            <button onClick={previousPage}>Anterior</button>
            <button onClick={pagina===3?sendform:nextPage}>{  pagina===3?'Enviar':'siguiente'}</button>
        </div>
        
      </header>
    </div>


  );
};

export default Queja;