import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { baseURL } from '../../api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FiArrowLeft, FiArrowRight, FiSend, FiUser, FiUsers, FiUserX, FiSettings } from 'react-icons/fi';

const Queja = () => {
    const navigate = useNavigate();
    const [pagina, setPagina] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    // Opciones para selects
    const sexo = ['Femenino', 'Masculino'];
    const estamento = ['Estudiante', 'Docente', 'Funcionario', 'Externo', 'Usuario de las instalaciones'];
    const sino = ['Si', 'No'];
    const identidad_genero_opt = ['Cisgénero', 'Transgénero', 'No binario', 'Género fluido', 'Otro'];
    const orientacion_sexual_opt = ['Heterosexual', 'Homosexual', 'Bisexual', 'Pansexual', 'Asexual', 'Queer', 'Demisexual', 'Otro'];
    const tipoVBG_opt = ['Economica', 'Sexual', 'Fisica'];
    const condicion_etnica = ['Indígena', 'Negro(a)', 'Mulato'];
    const facultades = [
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
    ];
    const sedes = ['Melendez', 'San Fernando', 'Buga', 'Caicedonia', 'Cartago', 'Norte del Cauca',
        'Pacífico', 'Palmira', 'Tuluá', 'Yumbo', 'Zarzal'];
    const vicerrectorias = [
        "Vicerrectoría Académica",
        "Vicerrectoría Administrativa",
        "Vicerrectoría de Bienestar Universitario",
        "Vicerrectoría de Investigaciones",
        "Vicerrectoría de Regionalización",
        "Vicerrectoría de Extensión y Proyección Social",
    ];

    // Estados del formulario
    const [persona_que_reporta, set_persona_que_reporta] = useState({
        'fecha_recepcion': '2024-06-00',
        'reporta_nombre': '',
        'reporta_sexo': '',
        'reporta_edad': '',
        'reporta_estamento': '',
        'reporta_vicerrectoria_adscrito': '',
        'reporta_dependencia': '',
        'reporta_programa_academico': '',
        'reporta_facultad': '',
        'reporta_sede': '',
        'reporta_celular': '',
        'reporta_correo': '',
    });

    const [datos_afectado, set_datos_afectado] = useState({
        'afectado_nombre': '',
        'afectado_sexo': '',
        'afectado_edad': '',
        'afectado_codigo': '',
        'afectado_comuna': '',
        'afectado_estrato_socioeconomico': '',
        'afectado_condicion_etnico_racial': '',
        'afectado_tiene_discapacidad': '',
        'afectado_tipo_discapacidad': '',
        'afectado_identidad_genero': '',
        'afectado_orientacion_sexual': '',
        'afectado_estamento': '',
        'afectado_vicerrectoria_adscrito': '',
        'afectado_dependencia': '',
        'afectado_programa_academico': '',
        'afectado_facultad': '',
        'afectado_sede': '',
        'afectado_celular': '',
        'afectado_correo': '',
        'afectado_tipo_vbg_os': '',
        'afectado_detalles_caso': '',
    });

    const [datos_agresor, set_datos_agresor] = useState({
        'agresor_nombre': '',
        'agresor_sexo': '',
        'agresor_edad': '',
        'agresor_condicion_etnico_racial': '',
        'agresor_tiene_discapacidad': '',
        'agresor_tipo_discapacidad': '',
        'agresor_identidad_genero': '',
        'agresor_orientacion_sexual': '',
        'agresor_estamento': '',
        'agresor_vicerrectoria_adscrito': '',
        'agresor_dependencia': '',
        'agresor_programa_academico': '',
        'agresor_facultad': '',
        'agresor_sede': '',
    });

    const [datos_adicionales, set_datos_adicionales] = useState({
        'desea_activar_ruta_atencion_integral': '',
        'recibir_asesoria_orientacion_sociopedagogica': '',
        'orientacion_psicologica': '',
        'asistencia_juridica': '',
        'acompañamiento_solicitud_medidas_proteccion_inicial': '',
        'acompañamiento_ante_instancias_gubernamentales': '',
        'interponer_queja_al_comite_asusntos_internos_disciplinarios': '',
        'observaciones': '',
        'nombre': '',
        'sede': '',
        'codigo': '',
        'tipo_de_acompanamiento': '',
        'fecha': '',
        'estado': '1',
        'detalles': 'no se',
        'facultad': '',
        'unidad': '',
    });

    // Navegación por pasos
    const steps = [
        { number: 1, title: "Persona que reporta", icon: FiUser },
        { number: 2, title: "Persona afectada", icon: FiUsers },
        { number: 3, title: "Persona agresora", icon: FiUserX },
        { number: 4, title: "Información adicional", icon: FiSettings }
    ];

    const onchange = useCallback((func, field, value) => {
        const finalValue = value.trim() === '-------------------------------------------------------------------' ? '' : value;
        func((prevState) => ({
            ...prevState,
            [field]: finalValue,
        }));
    }, []);

    const previousPage = () => {
        if (pagina > 0) {
            setPagina(pagina - 1);
        }
    };

    const nextPage = () => {
        if (pagina < 3) {
            setPagina(pagina + 1);
        }
    };

    const sendform = async () => {
        setIsLoading(true);
        const fecha = new Date();
        const fechaFormateada = `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;

        onchange(set_persona_que_reporta, "fecha_recepcion", fechaFormateada);

        const newform = { ...persona_que_reporta, ...datos_afectado, ...datos_agresor, ...datos_adicionales };
        console.log(newform);

        try {
            const response = await fetch(`${baseURL}/quejas/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newform),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error detallado en la respuesta:", errorData);
                alert("Error al enviar el formulario");
            } else {
                alert("¡Formulario enviado exitosamente!");
                navigate('/quejas/lista');
            }
        } catch (error) {
            console.log('No fue posible conectarse con el servidor');
            alert("Error de conexión");
        } finally {
            setIsLoading(false);
        }
    };

    // Componente para renderizar campos de formulario
    const FormField = useCallback(({ label, type = "text", value, onChange, options, isTextArea = false }) => (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            {options ? (
                <select
                    value={value}
                    onChange={onChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
                >
                    <option value="">Seleccionar...</option>
                    {options.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            ) : isTextArea ? (
                <textarea
                    value={value}
                    onChange={onChange}
                    rows="3"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200 resize-none"
                />
            ) : (
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
                />
            )}
        </div>
    ), []);
    
    return (
        <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
            {isLoading && <LoadingSpinner message="Enviando formulario..." overlay={true} />}

            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                        📝 Registro de queja
                    </h1>
                    <p className="text-sm text-gray-600">
                        Complete la información solicitada en cada sección
                    </p>
                    <div className="w-16 h-1 bg-red-600 rounded-full mt-1"></div>
                </div>

                {/* Navegación por Pasos - Horizontal en móvil */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
                    <div className="flex justify-between items-center space-x-2">
                        {steps.map((step, index) => {
                            const IconComponent = step.icon;
                            return (
                                <div
                                    key={step.number}
                                    className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 flex-1 min-w-0 ${pagina === index
                                            ? 'bg-red-600 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-600'
                                        }`}
                                >
                                    <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs ${pagina === index ? 'bg-white text-red-600' : 'bg-gray-300 text-gray-600'
                                        }`}>
                                        {step.number}
                                    </div>
                                    <span className="hidden sm:inline text-xs font-medium truncate">
                                        {step.title}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Contenido del Formulario */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    {/* Paso 1: Persona que Reporta */}
                    {pagina === 0 && (
                        <div>
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                    1
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Persona que reporta el caso</h2>
                                    <p className="text-xs text-gray-600">Información de la persona que realiza el reporte</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <FormField
                                        label="Nombre completo *"
                                        value={persona_que_reporta.reporta_nombre}
                                        onChange={(e) => onchange(set_persona_que_reporta, "reporta_nombre", e.target.value)}
                                    />
                                    <FormField
                                        label="Sexo *"
                                        value={persona_que_reporta.reporta_sexo}
                                        onChange={(e) => onchange(set_persona_que_reporta, "reporta_sexo", e.target.value)}
                                        options={sexo}
                                    />
                                    <FormField
                                        label="Edad *"
                                        type="number"
                                        value={persona_que_reporta.reporta_edad}
                                        onChange={(e) => onchange(set_persona_que_reporta, "reporta_edad", e.target.value)}
                                    />
                                    <FormField
                                        label="Estamento *"
                                        value={persona_que_reporta.reporta_estamento}
                                        onChange={(e) => onchange(set_persona_que_reporta, "reporta_estamento", e.target.value)}
                                        options={estamento}
                                    />
                                    <FormField
                                        label="Vicerrectoría *"
                                        value={persona_que_reporta.reporta_vicerrectoria_adscrito}
                                        onChange={(e) => onchange(set_persona_que_reporta, "reporta_vicerrectoria_adscrito", e.target.value)}
                                        options={vicerrectorias}
                                    />
                                    <FormField
                                        label="Dependencia *"
                                        value={persona_que_reporta.reporta_dependencia}
                                        onChange={(e) => onchange(set_persona_que_reporta, "reporta_dependencia", e.target.value)}
                                    />
                                </div>
                                <div>
                                    <FormField
                                        label="Facultad *"
                                        value={persona_que_reporta.reporta_facultad}
                                        onChange={(e) => onchange(set_persona_que_reporta, "reporta_facultad", e.target.value)}
                                        options={facultades}
                                    />
                                    <FormField
                                        label="Programa académico"
                                        value={persona_que_reporta.reporta_programa_academico}
                                        onChange={(e) => onchange(set_persona_que_reporta, "reporta_programa_academico", e.target.value)}
                                    />
                                    <FormField
                                        label="Sede *"
                                        value={persona_que_reporta.reporta_sede}
                                        onChange={(e) => onchange(set_persona_que_reporta, "reporta_sede", e.target.value)}
                                        options={sedes}
                                    />
                                    <FormField
                                        label="Celular *"
                                        type="tel"
                                        value={persona_que_reporta.reporta_celular}
                                        onChange={(e) => onchange(set_persona_que_reporta, "reporta_celular", e.target.value)}
                                    />
                                    <FormField
                                        label="Correo electrónico *"
                                        type="email"
                                        value={persona_que_reporta.reporta_correo}
                                        onChange={(e) => onchange(set_persona_que_reporta, "reporta_correo", e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Paso 2: Persona Afectada */}
                    {pagina === 1 && (
                        <div>
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                    2
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Persona afectada</h2>
                                    <p className="text-xs text-gray-600">Información de la persona que sufrió la situación</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <FormField
                                        label="Nombre completo *"
                                        value={datos_afectado.afectado_nombre}
                                        onChange={(e) => onchange(set_datos_afectado, "afectado_nombre", e.target.value)}
                                    />
                                    <FormField
                                        label="Sexo *"
                                        value={datos_afectado.afectado_sexo}
                                        onChange={(e) => onchange(set_datos_afectado, "afectado_sexo", e.target.value)}
                                        options={sexo}
                                    />
                                    <FormField
                                        label="Edad *"
                                        type="number"
                                        value={datos_afectado.afectado_edad}
                                        onChange={(e) => onchange(set_datos_afectado, "afectado_edad", e.target.value)}
                                    />
                                    <FormField
                                        label="Código"
                                        value={datos_afectado.afectado_codigo}
                                        onChange={(e) => onchange(set_datos_afectado, "afectado_codigo", e.target.value)}
                                    />
                                    <FormField
                                        label="Comuna de residencia"
                                        value={datos_afectado.afectado_comuna}
                                        onChange={(e) => onchange(set_datos_afectado, "afectado_comuna", e.target.value)}
                                    />
                                    <FormField
                                        label="Estrato socioeconómico"
                                        value={datos_afectado.afectado_estrato_socioeconomico}
                                        onChange={(e) => onchange(set_datos_afectado, "afectado_estrato_socioeconomico", e.target.value)}
                                    />
                                    <FormField
                                        label="Condición étnico racial"
                                        value={datos_afectado.afectado_condicion_etnico_racial}
                                        onChange={(e) => onchange(set_datos_afectado, "afectado_condicion_etnico_racial", e.target.value)}
                                        options={condicion_etnica}
                                    />
                                    <FormField
                                        label="¿Tiene discapacidad?"
                                        value={datos_afectado.afectado_tiene_discapacidad}
                                        onChange={(e) => onchange(set_datos_afectado, "afectado_tiene_discapacidad", e.target.value)}
                                        options={sino}
                                    />
                                    <FormField
                                        label="Tipo de discapacidad"
                                        value={datos_afectado.afectado_tipo_discapacidad}
                                        onChange={(e) => onchange(set_datos_afectado, "afectado_tipo_discapacidad", e.target.value)}
                                    />
                                </div>
                                <div>
                                    <FormField
                                        label="Identidad de género"
                                        value={datos_afectado.afectado_identidad_genero}
                                        onChange={(e) => onchange(set_datos_afectado, "afectado_identidad_genero", e.target.value)}
                                        options={identidad_genero_opt}
                                    />
                                    <FormField
                                        label="Orientación sexual"
                                        value={datos_afectado.afectado_orientacion_sexual}
                                        onChange={(e) => onchange(set_datos_afectado, "afectado_orientacion_sexual", e.target.value)}
                                        options={orientacion_sexual_opt}
                                    />
                                    <FormField
                                        label="Estamento *"
                                        value={datos_afectado.afectado_estamento}
                                        onChange={(e) => onchange(set_datos_afectado, "afectado_estamento", e.target.value)}
                                        options={estamento}
                                    />
                                    <FormField
                                        label="Vicerrectoría"
                                        value={datos_afectado.afectado_vicerrectoria_adscrito}
                                        onChange={(e) => onchange(set_datos_afectado, "afectado_vicerrectoria_adscrito", e.target.value)}
                                        options={vicerrectorias}
                                    />
                                    <FormField
                                        label="Dependencia"
                                        value={datos_afectado.afectado_dependencia}
                                        onChange={(e) => onchange(set_datos_afectado, "afectado_dependencia", e.target.value)}
                                    />
                                    <FormField
                                        label="Facultad"
                                        value={datos_afectado.afectado_facultad}
                                        onChange={(e) => onchange(set_datos_afectado, "afectado_facultad", e.target.value)}
                                        options={facultades}
                                    />
                                    <FormField
                                        label="Programa académico"
                                        value={datos_afectado.afectado_programa_academico}
                                        onChange={(e) => onchange(set_datos_afectado, "afectado_programa_academico", e.target.value)}
                                    />
                                    <FormField
                                        label="Sede"
                                        value={datos_afectado.afectado_sede}
                                        onChange={(e) => onchange(set_datos_afectado, "afectado_sede", e.target.value)}
                                        options={sedes}
                                    />
                                    <FormField
                                        label="Celular"
                                        type="tel"
                                        value={datos_afectado.afectado_celular}
                                        onChange={(e) => onchange(set_datos_afectado, "afectado_celular", e.target.value)}
                                    />
                                    <FormField
                                        label="Correo electrónico"
                                        type="email"
                                        value={datos_afectado.afectado_correo}
                                        onChange={(e) => onchange(set_datos_afectado, "afectado_correo", e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <FormField
                                    label="Tipo de violencia basada en género *"
                                    value={datos_afectado.afectado_tipo_vbg_os}
                                    onChange={(e) => onchange(set_datos_afectado, "afectado_tipo_vbg_os", e.target.value)}
                                    options={tipoVBG_opt}
                                />
                                <FormField
                                    label="Detalles del caso *"
                                    value={datos_afectado.afectado_detalles_caso}
                                    onChange={(e) => onchange(set_datos_afectado, "afectado_detalles_caso", e.target.value)}
                                    isTextArea={true}
                                />
                            </div>
                        </div>
                    )}

                    {/* Paso 3: Persona Agresora */}
                    {pagina === 2 && (
                        <div>
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                    3
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Persona agresora</h2>
                                    <p className="text-xs text-gray-600">Información de la persona presuntamente agresora</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <FormField
                                        label="Nombre completo"
                                        value={datos_agresor.agresor_nombre}
                                        onChange={(e) => onchange(set_datos_agresor, "agresor_nombre", e.target.value)}
                                    />
                                    <FormField
                                        label="Sexo"
                                        value={datos_agresor.agresor_sexo}
                                        onChange={(e) => onchange(set_datos_agresor, "agresor_sexo", e.target.value)}
                                        options={sexo}
                                    />
                                    <FormField
                                        label="Edad"
                                        type="number"
                                        value={datos_agresor.agresor_edad}
                                        onChange={(e) => onchange(set_datos_agresor, "agresor_edad", e.target.value)}
                                    />
                                    <FormField
                                        label="Condición étnico racial"
                                        value={datos_agresor.agresor_condicion_etnico_racial}
                                        onChange={(e) => onchange(set_datos_agresor, "agresor_condicion_etnico_racial", e.target.value)}
                                        options={condicion_etnica}
                                    />
                                    <FormField
                                        label="¿Tiene discapacidad?"
                                        value={datos_agresor.agresor_tiene_discapacidad}
                                        onChange={(e) => onchange(set_datos_agresor, "agresor_tiene_discapacidad", e.target.value)}
                                        options={sino}
                                    />
                                    <FormField
                                        label="Tipo de discapacidad"
                                        value={datos_agresor.agresor_tipo_discapacidad}
                                        onChange={(e) => onchange(set_datos_agresor, "agresor_tipo_discapacidad", e.target.value)}
                                    />
                                </div>
                                <div>
                                    <FormField
                                        label="Identidad de género"
                                        value={datos_agresor.agresor_identidad_genero}
                                        onChange={(e) => onchange(set_datos_agresor, "agresor_identidad_genero", e.target.value)}
                                        options={identidad_genero_opt}
                                    />
                                    <FormField
                                        label="Orientación sexual"
                                        value={datos_agresor.agresor_orientacion_sexual}
                                        onChange={(e) => onchange(set_datos_agresor, "agresor_orientacion_sexual", e.target.value)}
                                        options={orientacion_sexual_opt}
                                    />
                                    <FormField
                                        label="Estamento"
                                        value={datos_agresor.agresor_estamento}
                                        onChange={(e) => onchange(set_datos_agresor, "agresor_estamento", e.target.value)}
                                        options={estamento}
                                    />
                                    <FormField
                                        label="Vicerrectoría"
                                        value={datos_agresor.agresor_vicerrectoria_adscrito}
                                        onChange={(e) => onchange(set_datos_agresor, "agresor_vicerrectoria_adscrito", e.target.value)}
                                        options={vicerrectorias}
                                    />
                                    <FormField
                                        label="Dependencia"
                                        value={datos_agresor.agresor_dependencia}
                                        onChange={(e) => onchange(set_datos_agresor, "agresor_dependencia", e.target.value)}
                                    />
                                    <FormField
                                        label="Programa académico"
                                        value={datos_agresor.agresor_programa_academico}
                                        onChange={(e) => onchange(set_datos_agresor, "agresor_programa_academico", e.target.value)}
                                    />
                                    <FormField
                                        label="Facultad"
                                        value={datos_agresor.agresor_facultad}
                                        onChange={(e) => onchange(set_datos_agresor, "agresor_facultad", e.target.value)}
                                        options={facultades}
                                    />
                                    <FormField
                                        label="Sede"
                                        value={datos_agresor.agresor_sede}
                                        onChange={(e) => onchange(set_datos_agresor, "agresor_sede", e.target.value)}
                                        options={sedes}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Paso 4: Información Adicional */}
                    {pagina === 3 && (
                        <div>
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                    4
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Información adicional</h2>
                                    <p className="text-xs text-gray-600">Servicios y observaciones adicionales</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <FormField
                                        label="¿Desea activar la ruta de atención integral?"
                                        value={datos_adicionales.desea_activar_ruta_atencion_integral}
                                        onChange={(e) => onchange(set_datos_adicionales, "desea_activar_ruta_atencion_integral", e.target.value)}
                                        options={sino}
                                    />
                                    <FormField
                                        label="¿Requiere recibir asesoría y orientación socio-pedagógica?"
                                        value={datos_adicionales.recibir_asesoria_orientacion_sociopedagogica}
                                        onChange={(e) => onchange(set_datos_adicionales, "recibir_asesoria_orientacion_sociopedagogica", e.target.value)}
                                        options={sino}
                                    />
                                    <FormField
                                        label="¿Requiere recibir orientación psicológica?"
                                        value={datos_adicionales.orientacion_psicologica}
                                        onChange={(e) => onchange(set_datos_adicionales, "orientacion_psicologica", e.target.value)}
                                        options={sino}
                                    />
                                    <FormField
                                        label="¿Requiere recibir asistencia jurídica?"
                                        value={datos_adicionales.asistencia_juridica}
                                        onChange={(e) => onchange(set_datos_adicionales, "asistencia_juridica", e.target.value)}
                                        options={sino}
                                    />
                                </div>
                                <div>
                                    <FormField
                                        label="¿Requiere acompañamiento para medidas de protección?"
                                        value={datos_adicionales.acompañamiento_solicitud_medidas_proteccion_inicial}
                                        onChange={(e) => onchange(set_datos_adicionales, "acompañamiento_solicitud_medidas_proteccion_inicial", e.target.value)}
                                        options={sino}
                                    />
                                    <FormField
                                        label="¿Requiere acompañamiento ante instancias gubernamentales?"
                                        value={datos_adicionales.acompañamiento_ante_instancias_gubernamentales}
                                        onChange={(e) => onchange(set_datos_adicionales, "acompañamiento_ante_instancias_gubernamentales", e.target.value)}
                                        options={sino}
                                    />
                                    <FormField
                                        label="¿Requiere interponer queja formal?"
                                        value={datos_adicionales.interponer_queja_al_comite_asusntos_internos_disciplinarios}
                                        onChange={(e) => onchange(set_datos_adicionales, "interponer_queja_al_comite_asusntos_internos_disciplinarios", e.target.value)}
                                        options={sino}
                                    />
                                    <FormField
                                        label="Observaciones adicionales"
                                        value={datos_adicionales.observaciones}
                                        onChange={(e) => onchange(set_datos_adicionales, "observaciones", e.target.value)}
                                        isTextArea={true}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Navegación Inferior */}
                <div className="flex justify-between items-center">
                    <button
                        onClick={previousPage}
                        disabled={pagina === 0}
                        className={`flex items-center space-x-2 px-4 py-2 text-sm rounded-lg transition-all duration-200 ${pagina === 0
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow'
                            }`}
                    >
                        <FiArrowLeft size={16} />
                        <span>Anterior</span>
                    </button>

                    <div className="flex space-x-1">
                        {steps.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setPagina(index)}
                                className={`w-2 h-2 rounded-full transition-all duration-200 ${pagina === index ? 'bg-red-600 scale-125' : 'bg-gray-300 hover:bg-gray-400'
                                    }`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={pagina === 3 ? sendform : nextPage}
                        className={`flex items-center space-x-2 px-4 py-2 text-sm rounded-lg transition-all duration-200 ${pagina === 3
                                ? 'bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow'
                                : 'bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow'
                            }`}
                    >
                        <span>{pagina === 3 ? 'Enviar formulario' : 'Siguiente'}</span>
                        {pagina === 3 ? <FiSend size={16} /> : <FiArrowRight size={16} />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Queja;