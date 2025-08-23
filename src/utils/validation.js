// src/utils/validation.js

// Schéma de validation des fournisseurs
export const fournisseurSchema = {
  company_name: { required: true, type: 'string' },
  rccm_number: { required: true, type: 'string' },
  email: {
    required: true,
    type: 'string',
    validate: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
  },
  type: { required: true, type: 'string' },
  country: { required: true, type: 'string' },
  legal_representative: { required: true, type: 'string' },

  // Champs optionnels
  city: { required: false, type: 'string' },
  address: { required: false, type: 'string' },
  postal_code: { required: false, type: 'string' },
  contact_legal_representative: { required: false, type: 'string' },
  company_phone: { required: false, type: 'string' },
  website: { required: false, type: 'string' },
  description: { required: false, type: 'string' },
  annual_sales: { required: false, type: 'string' },
  number_of_employees: { required: false, type: 'string' },
  company_creation_date: { required: false, type: 'string' },
  business_sector: { required: false, type: 'string' },
}

// Nettoyer les en-têtes du fichier Excel
export function normalizeHeaders(headers) {
  return headers.map((h) => h.trim().toLowerCase())
}

// Vérifier que les en-têtes requis sont bien présents
export function validateHeaders(headers, schema = fournisseurSchema) {
  const requiredHeaders = Object.entries(schema)
    .filter(([_, def]) => def.required)
    .map(([key]) => key.toLowerCase())


    return requiredHeaders.every((header) => headers.includes(header))
}

// export function validateHeaders(headers) {
//   const required = [
//     'company_name',
//     'rccm_number',
//     'type',
//     'city',
//     'country',
//     'legal_representative',
//     'email'
//   ]

//   return required.every(h => headers.includes(h))
// }

// Valider une ligne du fichier Excel
export function validateRow(rowObj, rowIndex, schema = fournisseurSchema) {
    const errors = []

  for (const [key, def] of Object.entries(schema)) {
    const value = rowObj[key]

    if (def.required && (value === undefined || value === '')) {
      errors.push(`Ligne ${rowIndex + 2} : "${key}" est requis.`)
      continue
    }

    if (value !== undefined && def.type && typeof value !== def.type) {
      errors.push(`Ligne ${rowIndex + 2} : "${key}" doit être un ${def.type}.`)
      continue
    }

    if (value !== undefined && def.validate && !def.validate(value)) {
      errors.push(`Ligne ${rowIndex + 2} : "${key}" est invalide.`)
    }
  }

  return errors
}
