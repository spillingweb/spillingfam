import { createFileRoute } from '@tanstack/react-router'
import { useState, useCallback } from 'react'
import { User, Heart } from 'lucide-react'
import type { Node, Edge } from '@xyflow/react'
import {
  ReactFlow,
  Controls,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle,
  Position,
} from '@xyflow/react'

interface PersonData extends Record<string, unknown> {
  id: string
  name: string
  birth: string
  death?: string
  partnerId?: string
  color: string
}

// Custom node component for family members
function PersonNode({ data }: { data: PersonData }) {
  return (
    <div className="bg-white shadow-md p-4 w-40 hover:shadow-lg transition-all border-2 border-gray-200 hover:border-[#F28B1D] rounded-lg relative">
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="w-3 h-3 !bg-[#F28B1D]"
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left"
        className="w-3 h-3 !bg-[#D45E4C]"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="w-3 h-3 !bg-[#D45E4C]"
      />
      <div
        className="w-12 h-12 flex items-center justify-center mb-3 mx-auto rounded-md"
        style={{ backgroundColor: data.color }}
      >
        <User className="w-6 h-6 text-white" />
      </div>
      <h3 className="font-semibold text-gray-900 text-sm text-center mb-1">
        {data.name}
      </h3>
      <div className="text-xs text-gray-600 text-center uppercase tracking-wide">
        <div>{data.birth}</div>
        {data.death && <div>- {data.death}</div>}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="w-3 h-3 !bg-[#F28B1D]"
      />
    </div>
  )
}

const nodeTypes = {
  person: PersonNode,
}

const getPersonColor = (id: string) => {
  const colors = [
    '#F28B1D',
    '#B4EDCE',
    '#B3E9F5',
    '#D45E4C',
    '#F28B1D',
    '#B4EDCE',
    '#B3E9F5',
    '#D45E4C',
    '#F28B1D',
    '#B4EDCE',
    '#B3E9F5',
  ]
  return colors[parseInt(id) - 1] || colors[0]
}

function FamilyTree() {
  const [selectedPerson, setSelectedPerson] = useState<PersonData | null>(null)

  const familyMembers = [
    // Generation 1 (top) - Partners side by side
    {
      id: '1',
      name: 'Johan Olsen',
      birth: '1895',
      death: '1978',
      x: 300,
      y: 50,
      partnerId: '2',
    },
    {
      id: '2',
      name: 'Kari Johnsdatter',
      birth: '1898',
      death: '1982',
      x: 480,
      y: 50,
      partnerId: '1',
    },

    // Generation 2 - Partners grouped together
    {
      id: '3',
      name: 'Per Johansen',
      birth: '1920',
      death: '1995',
      x: 100,
      y: 220,
      partnerId: '4',
    },
    {
      id: '4',
      name: 'Ingrid Hansen',
      birth: '1924',
      death: '2001',
      x: 280,
      y: 220,
      partnerId: '3',
    },
    {
      id: '5',
      name: 'Henrik Johansen',
      birth: '1922',
      death: '1988',
      x: 600,
      y: 220,
    },

    // Generation 3 - Partners grouped together
    {
      id: '6',
      name: 'Kari Persdatter',
      birth: '1948',
      x: 50,
      y: 440,
      partnerId: '7',
    },
    {
      id: '7',
      name: 'Ola Andersen',
      birth: '1945',
      x: 230,
      y: 440,
      partnerId: '6',
    },
    { id: '8', name: 'Marit Persdatter', birth: '1952', x: 500, y: 440 },

    // Generation 4 (bottom) - Children centered below parents
    { id: '9', name: 'Lars Olsen', birth: '1975', x: 0, y: 660 },
    { id: '10', name: 'Sofie Olsen', birth: '1978', x: 140, y: 660 },
    { id: '11', name: 'Emma Hansen', birth: '1980', x: 280, y: 660 },
  ]

  // Convert family members to React Flow nodes
  const initialNodes: Node<PersonData>[] = familyMembers.map((person) => ({
    id: person.id,
    type: 'person',
    position: { x: person.x, y: person.y },
    data: {
      id: person.id,
      name: person.name,
      birth: person.birth,
      death: person.death,
      partnerId: person.partnerId,
      color: getPersonColor(person.id),
    },
  }))

  // Define relationships as edges
  const initialEdges: Edge[] = [
    // Partnerships (horizontal red dashed lines)
    {
      id: 'e1-2',
      source: '1',
      target: '2',
      sourceHandle: 'right',
      targetHandle: 'left',
      type: 'straight',
      style: { stroke: '#D45E4C', strokeWidth: 3, strokeDasharray: '5,5' },
    },
    {
      id: 'e3-4',
      source: '3',
      target: '4',
      sourceHandle: 'right',
      targetHandle: 'left',
      type: 'straight',
      style: { stroke: '#D45E4C', strokeWidth: 3, strokeDasharray: '5,5' },
    },
    {
      id: 'e6-7',
      source: '6',
      target: '7',
      sourceHandle: 'right',
      targetHandle: 'left',
      type: 'straight',
      style: { stroke: '#D45E4C', strokeWidth: 3, strokeDasharray: '5,5' },
    },

    // Generation 1 -> 2 (parent-child relationships with step edges)
    {
      id: 'e1-3',
      source: '1',
      target: '3',
      type: 'step',
      style: { stroke: '#F28B1D', strokeWidth: 2 },
    },
    {
      id: 'e2-3',
      source: '2',
      target: '3',
      type: 'step',
      style: { stroke: '#F28B1D', strokeWidth: 2 },
    },
    {
      id: 'e1-4',
      source: '1',
      target: '4',
      type: 'step',
      style: { stroke: '#F28B1D', strokeWidth: 2 },
    },
    {
      id: 'e2-4',
      source: '2',
      target: '4',
      type: 'step',
      style: { stroke: '#F28B1D', strokeWidth: 2 },
    },
    {
      id: 'e1-5',
      source: '1',
      target: '5',
      type: 'step',
      style: { stroke: '#F28B1D', strokeWidth: 2 },
    },
    {
      id: 'e2-5',
      source: '2',
      target: '5',
      type: 'step',
      style: { stroke: '#F28B1D', strokeWidth: 2 },
    },

    // Generation 2 -> 3
    {
      id: 'e3-6',
      source: '3',
      target: '6',
      type: 'step',
      style: { stroke: '#F28B1D', strokeWidth: 2 },
    },
    {
      id: 'e4-6',
      source: '4',
      target: '6',
      type: 'step',
      style: { stroke: '#F28B1D', strokeWidth: 2 },
    },
    {
      id: 'e3-7',
      source: '3',
      target: '7',
      type: 'step',
      style: { stroke: '#F28B1D', strokeWidth: 2 },
    },
    {
      id: 'e4-7',
      source: '4',
      target: '7',
      type: 'step',
      style: { stroke: '#F28B1D', strokeWidth: 2 },
    },
    {
      id: 'e3-8',
      source: '3',
      target: '8',
      type: 'step',
      style: { stroke: '#F28B1D', strokeWidth: 2 },
    },
    {
      id: 'e4-8',
      source: '4',
      target: '8',
      type: 'step',
      style: { stroke: '#F28B1D', strokeWidth: 2 },
    },

    // Generation 3 -> 4
    {
      id: 'e6-9',
      source: '6',
      target: '9',
      type: 'step',
      style: { stroke: '#F28B1D', strokeWidth: 2 },
    },
    {
      id: 'e7-9',
      source: '7',
      target: '9',
      type: 'step',
      style: { stroke: '#F28B1D', strokeWidth: 2 },
    },
    {
      id: 'e6-10',
      source: '6',
      target: '10',
      type: 'step',
      style: { stroke: '#F28B1D', strokeWidth: 2 },
    },
    {
      id: 'e7-10',
      source: '7',
      target: '10',
      type: 'step',
      style: { stroke: '#F28B1D', strokeWidth: 2 },
    },
    {
      id: 'e6-11',
      source: '6',
      target: '11',
      type: 'step',
      style: { stroke: '#F28B1D', strokeWidth: 2 },
    },
    {
      id: 'e7-11',
      source: '7',
      target: '11',
      type: 'step',
      style: { stroke: '#F28B1D', strokeWidth: 2 },
    },
    {
      id: 'e8-11',
      source: '8',
      target: '11',
      type: 'step',
      style: { stroke: '#F28B1D', strokeWidth: 2 },
    },
  ]

  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)

  // Debug: Log edges to console
  console.log('Edges:', edges.length, edges)

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedPerson(node.data as PersonData)
  }, [])

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="mb-10">
        <h2 className="text-4xl font-serif text-gray-900 mb-3">Slektstreet</h2>
        <p className="text-lg text-gray-600">
          Utforsk fire generasjoner av familiehistorie og tradisjoner
        </p>
      </div>

      {/* Family Tree Canvas */}
      <div className="bg-white shadow-md border-2 border-gray-200 overflow-hidden rounded-lg">
        <div className="h-175 [&_.react-flow\_\_edges]:relative [&_.react-flow\_\_edges]:z-10">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            fitView
            minZoom={0.5}
            maxZoom={2}
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
            defaultEdgeOptions={{
              style: { strokeWidth: 3, stroke: '#F28B1D' },
            }}
            className="bg-transparent"
            proOptions={{ hideAttribution: true }}
          >
            <Controls
              className="bg-white/90 border-2 border-gray-200 rounded-lg shadow-md [&_button]:bg-white [&_button]:border-gray-300 [&_button]:text-gray-700 [&_button:hover]:bg-gray-50 [&_button]:transition-all"
              showInteractive={false}
            />
          </ReactFlow>
        </div>

        {/* Instructions */}
        <div className="bg-white/90 backdrop-blur-sm px-6 py-4 border-t-2 border-gray-200">
          <p className="text-center text-gray-700 font-medium text-sm uppercase tracking-wide">
            Bruk hjulet for å zoome • Klikk på kort for detaljer • Panorér med
            musen
          </p>
        </div>
      </div>

      {/* Person Detail Modal */}
      {selectedPerson && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white shadow-2xl max-w-md w-full p-8 border-t-8 border-[#F28B1D] rounded-lg">
            <div
              className="w-20 h-20 flex items-center justify-center mb-6 mx-auto rounded-md"
              style={{ backgroundColor: selectedPerson.color }}
            >
              <User className="w-10 h-10 text-white" />
            </div>

            <h3 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
              {selectedPerson.name}
            </h3>

            <div className="space-y-3 mb-8">
              <div className="bg-gray-50 p-4 border-l-4 border-[#B4EDCE] rounded">
                <div className="text-sm text-gray-600 mb-1 uppercase tracking-wide">
                  Født
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {selectedPerson.birth}
                </div>
              </div>

              {selectedPerson.death && (
                <div className="bg-gray-50 p-4 border-l-4 border-gray-300 rounded">
                  <div className="text-sm text-gray-600 mb-1 uppercase tracking-wide">
                    Død
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {selectedPerson.death}
                  </div>
                </div>
              )}

              {selectedPerson.partnerId && (
                <div className="bg-gray-50 p-4 border-l-4 border-[#D45E4C] rounded">
                  <div className="text-sm text-gray-600 mb-1 flex items-center gap-2 uppercase tracking-wide">
                    <Heart className="w-4 h-4" />
                    Partner
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {
                      familyMembers.find(
                        (p) => p.id === selectedPerson.partnerId,
                      )?.name
                    }
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedPerson(null)}
              className="w-full py-3 bg-[#F28B1D] text-white font-medium hover:bg-[#D45E4C] transition-all uppercase tracking-wide rounded"
            >
              Lukk
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export const Route = createFileRoute('/family-tree')({
  component: FamilyTree,
})
