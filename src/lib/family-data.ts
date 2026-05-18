// Shared family data structure
export interface FamilyMember {
  id: string
  name: string
  birth: string
  death?: string
  parents?: string[]
  partnerId?: string
}

export const familyData: FamilyMember[] = [
  // Generation 1
  { id: '1', name: 'Johan Olsen', birth: '1895', death: '1978', partnerId: '2' },
  { id: '2', name: 'Kari Johnsdatter', birth: '1898', death: '1982', partnerId: '1' },
  
  // Generation 2 - children of 1 & 2
  { id: '3', name: 'Per Johansen', birth: '1920', death: '1995', parents: ['1', '2'], partnerId: '4' },
  { id: '4', name: 'Ingrid Hansen', birth: '1924', death: '2001', partnerId: '3' },
  { id: '5', name: 'Henrik Johansen', birth: '1922', death: '1988', parents: ['1', '2'] },
  
  // Generation 3 - children of 3 & 4
  { id: '6', name: 'Kari Persdatter', birth: '1948', parents: ['3', '4'], partnerId: '7' },
  { id: '7', name: 'Ola Andersen', birth: '1945', partnerId: '6' },
  { id: '8', name: 'Marit Persdatter', birth: '1952', parents: ['3', '4'] },
  
  // Generation 4 - children of 6 & 7
  { id: '9', name: 'Lars Olsen', birth: '1975', parents: ['6', '7'] },
  { id: '10', name: 'Sofie Olsen', birth: '1978', parents: ['6', '7'] },
  { id: '11', name: 'Emma Hansen', birth: '1980', parents: ['6', '7'] },
]

// Helper to get family member by ID
export const getFamilyMemberById = (id: string): FamilyMember | undefined => {
  return familyData.find(member => member.id === id)
}

// Helper to get family member by name
export const getFamilyMemberByName = (name: string): FamilyMember | undefined => {
  return familyData.find(member => member.name === name)
}

// Get all family members as options for select/autocomplete
export const getFamilyMemberOptions = () => {
  return familyData.map(member => ({
    value: member.id,
    label: member.name,
  }))
}
