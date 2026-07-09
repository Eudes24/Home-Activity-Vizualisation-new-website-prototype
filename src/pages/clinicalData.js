export const participant = {
  age: '84 years',
  sex: 'Female',
  livingArea: 'Rural',
}

export const participationPeriod = '06 September 2016 – 27 October 2017'

export const visits = [
  { key: 'T0', sub: 'Sep 2016', completed: true },
  { key: 'T6', sub: 'Mar 2017', completed: true },
  { key: 'T12', sub: 'Sep 2017', completed: true },
  { key: 'T18', sub: '', completed: false },
  { key: 'T24', sub: '', completed: false },
]

export const statusCards = ['Cognitive Status', 'Physical Status', 'Frailty Index', 'Fall risk', 'Mood']

export const clinicalBackground = [
  { label: 'Medical conditions', value: 'Hypertension, Type 2 diabetes, Osteoarthritis' },
  { label: 'Chronic diseases', value: 'Yes (3)' },
  { label: 'Sensory Impairments', value: 'Hearing impairment' },
  { label: 'Mobility limitations', value: 'Uses cane outdoors' },
  { label: '5 medications', value: '' },
]

export const assessments = [
  { label: 'MMSE (score/30)', values: [27, 26, 24] },
  { label: 'SPPB (score/12)', values: [9, 8, 7] },
  { label: 'Time up and go (score/s)', values: [12, 14, 16] },
  { label: 'Five stand (score/s)', values: [13, 15, 17] },
  { label: 'Mini nutrition assessment (score/30)', values: [25, 24, 22] },
  { label: 'SEGA (score/24)', values: [8, 10, 11] },
  { label: 'Neuropsychological assessment', values: [26, 25, 23], highlighted: true },
]

export const secondaryMeasures = [
  { label: 'Quality of life (score/x)', values: [26, 25, 24] },
  { label: 'CESD-R depression (score/x)', values: [12, 14, 16] },
  { label: 'PSQI sleep (score/x)', values: [7, 8, 9] },
  { label: 'Whoqol BREF (score/x)', values: [70, 68, 64] },
  { label: 'Cognitive difficulties CDS (score/x)', values: [4, 5, 6] },
  { label: 'Lawton Assessment (IADL)', values: [7, 6, 6] },
]

export const majorEvents = [
  {
    date: '02 Feb 2017',
    type: 'Fall',
    details: 'Fall at home, no fracture, systemic failure at that time no detection recorded, hospitalisation: 4 days',
  },
  {
    date: '05 Mar 2017',
    type: 'Hospitalisation',
    details: 'Duration: 23 days',
  },
  {
    date: '02 Jul 2017',
    type: 'Fall',
    details: 'Hospitalisation: 23 days',
  },
]
