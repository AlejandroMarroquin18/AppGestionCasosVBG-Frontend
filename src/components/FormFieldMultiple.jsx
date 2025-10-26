import React from "react";


const tipoVBG_opt = [
  "Económica",
  "Sexual",
  "Física",
  "Psicológica",
  "Patrimonial",
  "Estructural",
  "Vicaria",
  "Otro",
  "No es una violencia basada en género",
];


/*
Se usa así:
<FormFieldMultiple
  label="Tipo de violencia basada en género *"
  value={datos_afectado.afectado_tipo_vbg_os}
  field="afectado_tipo_vbg_os"
  onChange={(e) => onchange(set_datos_afectado, e.field, e.target.value)}
/>

*/
function FormFieldMultiple({ label, value, onChange, field, options=tipoVBG_opt}) {
  // Convertir el string (por ejemplo: "Sexual, Física") en un array
  const selectedValues = value
    ? value.split(",").map((v) => v.trim())
    : [];

  const handleSelect = (option) => {
    let newValues = [...selectedValues];
    

    if (newValues.includes(option)) {
      // Quitar la opción si ya está seleccionada
      newValues = newValues.filter((v) => v !== option);
    } else {
      // Agregar la opción si no está
      newValues.push(option);
    }
    console.log("Selected values before:", newValues);

    // Convertir el array en string separado por comas
    const newString = newValues.join(", ");

    // Llamar tu función onchange con los mismos parámetros
    onChange({
      target: { value: newString },
      field,
    });
  };

  return (
    <div>
      <label>{label}</label>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          marginTop: "5px",
        }}
      >
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => handleSelect(option)}
            style={{
              padding: "6px 12px",
              borderRadius: "8px",
              border: selectedValues.includes(option)
                ? "2px solid #007bff"
                : "1px solid #ccc",
              backgroundColor: selectedValues.includes(option)
                ? "#e7f0ff"
                : "white",
              cursor: "pointer",
            }}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export default FormFieldMultiple;
