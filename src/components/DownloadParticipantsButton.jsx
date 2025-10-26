import React from 'react';
import { FiDownload, FiFileText, FiTable } from 'react-icons/fi';

const DownloadParticipantsButton = ({ participants, workshop }) => {
  const generatePDF = async () => {
    const jsPDF = (await import('jspdf')).default;
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    let yPosition = 20;
    const lineHeight = 7;
    const rowHeight = 8;
    
    // Título
    pdf.setFontSize(20);
    pdf.setTextColor(220, 38, 38); // Rojo
    pdf.text('Lista de Participantes', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 10;
    pdf.setFontSize(16);
    pdf.setTextColor(55, 65, 81); // Gris oscuro
    pdf.text(workshop.name, pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 8;
    pdf.setFontSize(10);
    pdf.setTextColor(107, 114, 128); // Gris medio
    const fecha = new Date(workshop.date).toLocaleDateString('es-ES');
    pdf.text(`Fecha: ${fecha} | Lugar: ${workshop.location}`, pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 5;
    pdf.text(`Total de participantes: ${participants.length}`, pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 15;
    
    // Encabezados de tabla
    pdf.setFontSize(9);
    pdf.setTextColor(255, 255, 255); // Blanco
    pdf.setFillColor(220, 38, 38); // Fondo rojo
    
    // Dibujar fila de encabezados con más espacio
    const headerY = yPosition - 6;
    pdf.rect(10, headerY, pageWidth - 20, 8, 'F');
    
    // Texto de encabezados con posiciones ajustadas
    pdf.text('#', 14, yPosition);
    pdf.text('Nombre', 22, yPosition);
    pdf.text('Email', 65, yPosition);
    pdf.text('Documento', 110, yPosition);
    pdf.text('Programa', 150, yPosition);
    pdf.text('Edad', 185, yPosition);
    
    yPosition += 4;
    
    // Línea separadora
    pdf.setDrawColor(200, 200, 200);
    pdf.line(10, yPosition, pageWidth - 10, yPosition);
    
    yPosition += 3;
    
    // Datos de participantes
    pdf.setTextColor(0, 0, 0); // Negro
    pdf.setFontSize(8);
    
    participants.forEach((participant, index) => {
      // Verificar si necesita nueva página
      if (yPosition > 270) {
        pdf.addPage();
        yPosition = 20;
        
        // Volver a dibujar encabezados en nueva página
        pdf.setFontSize(9);
        pdf.setTextColor(255, 255, 255);
        pdf.setFillColor(220, 38, 38);
        pdf.rect(10, yPosition - 6, pageWidth - 20, 8, 'F');
        pdf.text('#', 14, yPosition);
        pdf.text('Nombre', 22, yPosition);
        pdf.text('Email', 65, yPosition);
        pdf.text('Documento', 110, yPosition);
        pdf.text('Programa', 150, yPosition);
        pdf.text('Edad', 185, yPosition);
        yPosition += 7;
        pdf.setDrawColor(200, 200, 200);
        pdf.line(10, yPosition, pageWidth - 10, yPosition);
        yPosition += 3;
        pdf.setFontSize(8);
        pdf.setTextColor(0, 0, 0);
      }
      
      // Datos del participante
      pdf.text((index + 1).toString(), 14, yPosition);
      pdf.text(participant.full_name.substring(0, 28), 22, yPosition);
      pdf.text(participant.email.substring(0, 30), 65, yPosition);
      pdf.text(`${participant.document_type}: ${participant.document_number}`, 110, yPosition);
      pdf.text(participant.program.substring(0, 22), 150, yPosition);
      pdf.text(participant.age.toString(), 185, yPosition);
      
      yPosition += rowHeight;
      
      // Línea separadora entre filas
      if (index < participants.length - 1) {
        pdf.setDrawColor(240, 240, 240);
        pdf.line(10, yPosition - 2, pageWidth - 10, yPosition - 2);
      }
    });
    
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
    pdf.save(`participantes-${workshop.name.replace(/\s+/g, '-').toLowerCase()}.pdf`);
  };

  const generateExcel = () => {
    // Crear contenido CSV (compatible con Excel)
    const headers = ['#', 'Nombre Completo', 'Email', 'Tipo Documento', 'Número Documento', 'Programa', 'Edad', 'Género', 'Autoreconocimiento'];
    
    const csvContent = [
      ['LISTA DE PARTICIPANTES'],
      [workshop.name],
      [`Fecha: ${new Date(workshop.date).toLocaleDateString('es-ES')}`],
      [`Lugar: ${workshop.location}`],
      [`Total participantes: ${participants.length}`],
      [], // línea vacía
      headers,
      ...participants.map((participant, index) => [
        index + 1,
        participant.full_name,
        participant.email,
        participant.document_type,
        participant.document_number,
        participant.program,
        participant.age,
        participant.gender_identity,
        participant.self_recognition
      ])
    ];

    // Convertir a string CSV
    const csvString = csvContent.map(row => 
      row.map(field => `"${field}"`).join(',')
    ).join('\n');

    // Crear y descargar archivo
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `participantes-${workshop.name.replace(/\s+/g, '-').toLowerCase()}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [showDropdown, setShowDropdown] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow"
        title="Descargar lista de participantes"
      >
        <FiDownload size={16} />
        <span>Descargar lista</span>
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
                  generateExcel();
                  setShowDropdown(false);
                }}
                className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
              >
                <FiTable className="text-green-500" size={16} />
                <span>Descargar Excel</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DownloadParticipantsButton;