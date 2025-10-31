import React from 'react';
import { FiDownload, FiFileText, FiTable } from 'react-icons/fi';

const DownloadComplaintButton = ({ complaint, registros }) => {
  const generatePDF = async () => {
    const jsPDF = (await import('jspdf')).default;
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    let yPosition = 20;
    const lineHeight = 7;
    const rowHeight = 8;

    // Configurar fuente para caracteres especiales
    pdf.setFont('helvetica');
    
    // Título principal
    pdf.setFontSize(20);
    pdf.setTextColor(220, 38, 38);
    pdf.text('DETALLES DE QUEJA', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 10;
    pdf.setFontSize(14);
    pdf.setTextColor(55, 65, 81);
    pdf.text(`ID: ${complaint.id}`, pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 8;
    pdf.setFontSize(12);
    pdf.setTextColor(107, 114, 128);
    pdf.text(`Estado: ${complaint.estado} | Prioridad: ${complaint.prioridad}`, pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 15;

    // Función para agregar nueva página con encabezado
    const addNewPage = () => {
      pdf.addPage();
      yPosition = 20;
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Queja ID: ${complaint.id} - Página ${pdf.internal.getNumberOfPages()}`, pageWidth / 2, 10, { align: 'center' });
      pdf.setTextColor(0, 0, 0);
    };

    // Función para verificar espacio en página
    const checkSpace = (linesNeeded = 10) => {
      if (yPosition + (linesNeeded * lineHeight) > 270) {
        addNewPage();
        return true;
      }
      return false;
    };

    // Función para agregar sección
    const addSection = (title, fields) => {
      checkSpace(fields.length + 5);
      pdf.setFontSize(16);
      pdf.setTextColor(220, 38, 38);
      pdf.text(title, 15, yPosition);
      yPosition += 8;
      
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      
      fields.forEach(field => {
        if (yPosition > 260) addNewPage();
        const value = field.value ? String(field.value) : 'No especificado';
        // Truncar texto muy largo
        const truncatedValue = value.length > 80 ? value.substring(0, 80) + '...' : value;
        pdf.text(`${field.label}: ${truncatedValue}`, 20, yPosition);
        yPosition += lineHeight;
      });
      
      yPosition += 10;
    };

    // Sección: Persona que reporta
    addSection('PERSONA QUE REPORTA', [
      { label: 'Fecha recepción', value: complaint.fecha_recepcion },
      { label: 'Nombre', value: complaint.reporta_nombre },
      { label: 'Sexo', value: complaint.reporta_sexo },
      { label: 'Edad', value: complaint.reporta_edad },
      { label: 'Estamento', value: complaint.reporta_estamento },
      { label: 'Vicerrectoría', value: complaint.reporta_vicerrectoria_adscrito },
      { label: 'Dependencia', value: complaint.reporta_dependencia },
      { label: 'Programa académico', value: complaint.reporta_programa_academico },
      { label: 'Facultad', value: complaint.reporta_facultad },
      { label: 'Sede', value: complaint.reporta_sede },
      { label: 'Celular', value: complaint.reporta_celular },
      { label: 'Correo', value: complaint.reporta_correo }
    ]);

    // Sección: Persona afectada
    addSection('PERSONA AFECTADA', [
      { label: 'Nombre', value: complaint.afectado_nombre },
      { label: 'Sexo', value: complaint.afectado_sexo },
      { label: 'Edad', value: complaint.afectado_edad },
      { label: 'Tipo documento', value: complaint.afectado_tipo_documento_identidad },
      { label: 'Número documento', value: complaint.afectado_documento_identidad },
      { label: 'Código', value: complaint.afectado_codigo },
      { label: 'Semestre', value: complaint.afectado_semestre },
      { label: 'Dirección', value: complaint.afectado_direccion },
      { label: 'Barrio', value: complaint.afectado_barrio },
      { label: 'Ciudad origen', value: complaint.afectado_ciudad_origen },
      { label: 'Comuna', value: complaint.afectado_comuna },
      { label: 'Estrato', value: complaint.afectado_estrato_socioeconomico },
      { label: 'Condición étnico-racial', value: complaint.afectado_condicion_etnico_racial },
      { label: 'Tiene discapacidad', value: complaint.afectado_tiene_discapacidad },
      { label: 'Tipo discapacidad', value: complaint.afectado_tipo_discapacidad },
      { label: 'Identidad género', value: complaint.afectado_identidad_genero },
      { label: 'Orientación sexual', value: complaint.afectado_orientacion_sexual },
      { label: 'Estamento', value: complaint.afectado_estamento },
      { label: 'Vicerrectoría', value: complaint.afectado_vicerrectoria_adscrito },
      { label: 'Dependencia', value: complaint.afectado_dependencia },
      { label: 'Programa académico', value: complaint.afectado_programa_academico },
      { label: 'Facultad', value: complaint.afectado_facultad },
      { label: 'Sede', value: complaint.afectado_sede },
      { label: 'Celular', value: complaint.afectado_celular },
      { label: 'Correo', value: complaint.afectado_correo },
      { label: 'Denuncias previas', value: complaint.afectado_ha_hecho_denuncia },
      { label: 'Detalles denuncias', value: complaint.afectado_denuncias_previas },
      { label: 'Redes apoyo', value: complaint.afectado_redes_apoyo },
      { label: 'Tipo VBG', value: complaint.afectado_tipo_vbg_os },
      { label: 'Detalles caso', value: complaint.afectado_detalles_caso }
    ]);

    // Sección: Persona agresora
    addSection('PERSONA AGRESORA', [
      { label: 'Nombre', value: complaint.agresor_nombre },
      { label: 'Sexo', value: complaint.agresor_sexo },
      { label: 'Edad', value: complaint.agresor_edad },
      { label: 'Semestre', value: complaint.agresor_semestre },
      { label: 'Barrio', value: complaint.agresor_barrio },
      { label: 'Ciudad origen', value: complaint.agresor_ciudad_origen },
      { label: 'Condición étnico-racial', value: complaint.agresor_condicion_etnico_racial },
      { label: 'Tiene discapacidad', value: complaint.agresor_tiene_discapacidad },
      { label: 'Tipo discapacidad', value: complaint.agresor_tipo_discapacidad },
      { label: 'Identidad género', value: complaint.agresor_identidad_genero },
      { label: 'Orientación sexual', value: complaint.agresor_orientacion_sexual },
      { label: 'Estamento', value: complaint.agresor_estamento },
      { label: 'Vicerrectoría', value: complaint.agresor_vicerrectoria_adscrito },
      { label: 'Dependencia', value: complaint.agresor_dependencia },
      { label: 'Programa académico', value: complaint.agresor_programa_academico },
      { label: 'Facultad', value: complaint.agresor_facultad },
      { label: 'Sede', value: complaint.agresor_sede },
      { label: 'Factores riesgo', value: complaint.agresor_factores_riesgo },
      { label: 'Denuncias previas', value: complaint.agresor_tiene_denuncias },
      { label: 'Detalles denuncias', value: complaint.agresor_detalles_denuncias }
    ]);

    // Sección: Detalles adicionales
    addSection('INFORMACIÓN ADICIONAL Y SERVICIOS SOLICITADOS', [
      { label: 'Activar ruta atención integral', value: complaint.desea_activar_ruta_atencion_integral },
      { label: 'Asesoría socio-pedagógica', value: complaint.recibir_asesoria_orientacion_sociopedagogica },
      { label: 'Orientación psicológica', value: complaint.orientacion_psicologica },
      { label: 'Asistencia jurídica', value: complaint.asistencia_juridica },
      { label: 'Medidas protección inicial', value: complaint.acompañamiento_solicitud_medidas_proteccion_inicial },
      { label: 'Acompañamiento instancias gubernamentales', value: complaint.acompañamiento_ante_instancias_gubernamentales },
      { label: 'Queja formal comité', value: complaint.interponer_queja_al_comite_asusntos_internos_disciplinarios },
      { label: 'Observaciones', value: complaint.observaciones }
    ]);

    // Sección: Historial de registros
    if (registros && registros.length > 0) {
      checkSpace(15);
      pdf.setFontSize(16);
      pdf.setTextColor(220, 38, 38);
      pdf.text('HISTORIAL DE REGISTROS', 15, yPosition);
      yPosition += 10;

      pdf.setFontSize(9);
      registros.forEach((registro, index) => {
        checkSpace(8);
        
        // Encabezado del registro
        pdf.setFillColor(240, 240, 240);
        pdf.rect(15, yPosition - 4, pageWidth - 30, 6, 'F');
        pdf.setTextColor(0, 0, 0);
        pdf.text(`Registro ${index + 1} - ${registro.fecha} - ${registro.tipo}`, 18, yPosition);
        yPosition += 8;

        // Descripción
        const descLines = pdf.splitTextToSize(registro.descripcion || 'Sin descripción', pageWidth - 40);
        descLines.forEach(line => {
          if (yPosition > 260) addNewPage();
          pdf.text(line, 20, yPosition);
          yPosition += lineHeight;
        });

        yPosition += 5;
        
        // Línea separadora
        if (index < registros.length - 1) {
          pdf.setDrawColor(200, 200, 200);
          pdf.line(15, yPosition, pageWidth - 15, yPosition);
          yPosition += 8;
        }
      });
    }

    // Pie de página
    const currentDate = new Date().toLocaleDateString('es-ES');
    const currentTime = new Date().toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    pdf.setFontSize(8);
    pdf.setTextColor(107, 114, 128);
    pdf.text(`Generado el ${currentDate} a las ${currentTime}`, pageWidth / 2, 290, { align: 'center' });

    // Guardar PDF
    pdf.save(`queja-${complaint.id}-detalles.pdf`);
  };

  const generateCSV = () => {
    // Crear contenido CSV estructurado
    const csvContent = [
      ['DETALLES DE QUEJA - SISTEMA DE GESTIÓN'],
      [`ID: ${complaint.id}`],
      [`Estado: ${complaint.estado}`],
      [`Prioridad: ${complaint.prioridad}`],
      [`Fecha de generación: ${new Date().toLocaleDateString('es-ES')}`],
      [], // línea vacía
      
      ['SECCIÓN: PERSONA QUE REPORTA'],
      ...getReportaData(),
      [], // línea vacía
      
      ['SECCIÓN: PERSONA AFECTADA'],
      ...getAfectadoData(),
      [], // línea vacía
      
      ['SECCIÓN: PERSONA AGRESORA'],
      ...getAgresorData(),
      [], // línea vacía
      
      ['SECCIÓN: INFORMACIÓN ADICIONAL Y SERVICIOS SOLICITADOS'],
      ...getDetallesData(),
    ];

    // Agregar historial si existe
    if (registros && registros.length > 0) {
      csvContent.push(
        [], // línea vacía
        ['HISTORIAL DE REGISTROS'],
        ['Fecha', 'Tipo', 'Descripción'],
        ...registros.map(reg => [reg.fecha, reg.tipo, `"${reg.descripcion?.replace(/"/g, '""') || 'Sin descripción'}"`])
      );
    }

    // Convertir a string CSV
    const csvString = csvContent.map(row => 
      row.map(field => field ? `"${String(field).replace(/"/g, '""')}"` : '""').join(',')
    ).join('\n');

    // Crear y descargar archivo
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `queja-${complaint.id}-detalles.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Funciones auxiliares para estructurar datos CSV
  const getReportaData = () => {
    return [
      ['Campo', 'Valor'],
      ['Fecha recepción', complaint.fecha_recepcion],
      ['Nombre', complaint.reporta_nombre],
      ['Sexo', complaint.reporta_sexo],
      ['Edad', complaint.reporta_edad],
      ['Estamento', complaint.reporta_estamento],
      ['Vicerrectoría', complaint.reporta_vicerrectoria_adscrito],
      ['Dependencia', complaint.reporta_dependencia],
      ['Programa académico', complaint.reporta_programa_academico],
      ['Facultad', complaint.reporta_facultad],
      ['Sede', complaint.reporta_sede],
      ['Celular', complaint.reporta_celular],
      ['Correo', complaint.reporta_correo]
    ];
  };

  const getAfectadoData = () => {
    return [
      ['Campo', 'Valor'],
      ['Nombre', complaint.afectado_nombre],
      ['Sexo', complaint.afectado_sexo],
      ['Edad', complaint.afectado_edad],
      ['Tipo documento', complaint.afectado_tipo_documento_identidad],
      ['Número documento', complaint.afectado_documento_identidad],
      ['Código', complaint.afectado_codigo],
      ['Semestre', complaint.afectado_semestre],
      ['Dirección', complaint.afectado_direccion],
      ['Barrio', complaint.afectado_barrio],
      ['Ciudad origen', complaint.afectado_ciudad_origen],
      ['Comuna', complaint.afectado_comuna],
      ['Estrato', complaint.afectado_estrato_socioeconomico],
      ['Condición étnico-racial', complaint.afectado_condicion_etnico_racial],
      ['Tiene discapacidad', complaint.afectado_tiene_discapacidad],
      ['Tipo discapacidad', complaint.afectado_tipo_discapacidad],
      ['Identidad género', complaint.afectado_identidad_genero],
      ['Orientación sexual', complaint.afectado_orientacion_sexual],
      ['Estamento', complaint.afectado_estamento],
      ['Vicerrectoría', complaint.afectado_vicerrectoria_adscrito],
      ['Dependencia', complaint.afectado_dependencia],
      ['Programa académico', complaint.afectado_programa_academico],
      ['Facultad', complaint.afectado_facultad],
      ['Sede', complaint.afectado_sede],
      ['Celular', complaint.afectado_celular],
      ['Correo', complaint.afectado_correo],
      ['Denuncias previas', complaint.afectado_ha_hecho_denuncia],
      ['Detalles denuncias', complaint.afectado_denuncias_previas],
      ['Redes apoyo', complaint.afectado_redes_apoyo],
      ['Tipo VBG', complaint.afectado_tipo_vbg_os],
      ['Detalles caso', complaint.afectado_detalles_caso]
    ];
  };

  const getAgresorData = () => {
    return [
      ['Campo', 'Valor'],
      ['Nombre', complaint.agresor_nombre],
      ['Sexo', complaint.agresor_sexo],
      ['Edad', complaint.agresor_edad],
      ['Semestre', complaint.agresor_semestre],
      ['Barrio', complaint.agresor_barrio],
      ['Ciudad origen', complaint.agresor_ciudad_origen],
      ['Condición étnico-racial', complaint.agresor_condicion_etnico_racial],
      ['Tiene discapacidad', complaint.agresor_tiene_discapacidad],
      ['Tipo discapacidad', complaint.agresor_tipo_discapacidad],
      ['Identidad género', complaint.agresor_identidad_genero],
      ['Orientación sexual', complaint.agresor_orientacion_sexual],
      ['Estamento', complaint.agresor_estamento],
      ['Vicerrectoría', complaint.agresor_vicerrectoria_adscrito],
      ['Dependencia', complaint.agresor_dependencia],
      ['Programa académico', complaint.agresor_programa_academico],
      ['Facultad', complaint.agresor_facultad],
      ['Sede', complaint.agresor_sede],
      ['Factores riesgo', complaint.agresor_factores_riesgo],
      ['Denuncias previas', complaint.agresor_tiene_denuncias],
      ['Detalles denuncias', complaint.agresor_detalles_denuncias]
    ];
  };

  const getDetallesData = () => {
    return [
      ['Campo', 'Valor'],
      ['Activar ruta atención integral', complaint.desea_activar_ruta_atencion_integral],
      ['Asesoría socio-pedagógica', complaint.recibir_asesoria_orientacion_sociopedagogica],
      ['Orientación psicológica', complaint.orientacion_psicologica],
      ['Asistencia jurídica', complaint.asistencia_juridica],
      ['Medidas protección inicial', complaint.acompañamiento_solicitud_medidas_proteccion_inicial],
      ['Acompañamiento instancias gubernamentales', complaint.acompañamiento_ante_instancias_gubernamentales],
      ['Queja formal comité', complaint.interponer_queja_al_comite_asusntos_internos_disciplinarios],
      ['Observaciones', complaint.observaciones]
    ];
  };

  const [showDropdown, setShowDropdown] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow"
        title="Descargar detalles de la queja"
      >
        <FiDownload size={16} />
        <span>Descargar</span>
      </button>

      {showDropdown && (
        <>
          {/* Overlay para cerrar al hacer clic fuera */}
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          />
          
          {/* Dropdown menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="py-1">
              <button
                onClick={() => {
                  generatePDF();
                  setShowDropdown(false);
                }}
                className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
              >
                <FiFileText className="text-red-500" size={16} />
                <span>Descargar PDF</span>
              </button>
              
              <button
                onClick={() => {
                  generateCSV();
                  setShowDropdown(false);
                }}
                className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
              >
                <FiTable className="text-green-500" size={16} />
                <span>Descargar CSV</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DownloadComplaintButton;