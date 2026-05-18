import { createFileRoute } from '@tanstack/react-router'
import { useState, useCallback, useMemo } from 'react'
import { User, Heart } from 'lucide-react'
import type { Node, Edge } from '@xyflow/react'
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import {
  ReactFlow,
  Controls,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
} from '@xyflow/react'
import dagre from 'dagre'

interface PersonData extends Record<string, unknown> {
  id: string
  name: string
  birth: string
  death?: string
  parents?: string[] // IDs of parents
  partnerId?: string
  color: string
}

// Simple data structure - just define people and their parents
const familyData = [
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

// Custom node component for family members
function PersonNode({ data }: { data: PersonData }) {
  return (
    <div className="bg-card shadow-md p-4 w-40 hover:shadow-lg transition-all border-2 border-border hover:border-primary rounded-lg relative">
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="w-3 h-3 !bg-primary"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="w-3 h-3 !bg-destructive"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="w-3 h-3 !bg-destructive"
      />
      <div
        className="w-12 h-12 flex items-center justify-center mb-3 mx-auto rounded-md"
        style={{ backgroundColor: data.color }}
      >
        <User className="w-6 h-6 text-primary-foreground" />
      </div>
      <h3 className="font-semibold text-foreground text-sm text-center mb-1">
        {data.name}
      </h3>
      <div className="text-xs text-muted-foreground text-center uppercase tracking-wide">
        <div>{data.birth}</div>
        {data.death && <div>- {data.death}</div>}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="w-3 h-3 !bg-primary"
      />
    </div>
  )
}

const nodeTypes = {
  person: PersonNode,
}

const getPersonColor = (id: string) => {
  const colors = [
    'oklch(0.52 0.123 42.70)', // rusty-spice
    'oklch(0.44 0.044 162.97)', // pine-teal
    'oklch(0.36 0.062 227.50)', // charcoal-blue
    'oklch(0.53 0.084 55.73)', // toffee-brown
    'oklch(0.52 0.123 42.70)', // rusty-spice
    'oklch(0.44 0.044 162.97)', // pine-teal
    'oklch(0.36 0.062 227.50)', // charcoal-blue
    'oklch(0.53 0.084 55.73)', // toffee-brown
    'oklch(0.52 0.123 42.70)', // rusty-spice
    'oklch(0.44 0.044 162.97)', // pine-teal
    'oklch(0.36 0.062 227.50)', // charcoal-blue
  ]
  return colors[parseInt(id) - 1] || colors[0]
}

// Auto-layout function using Dagre
const getLayoutedElements = (
  nodes: Node<PersonData>[],
  edges: Edge[],
  direction = 'TB'
) => {
  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))
  
  const nodeWidth = 160 // w-40 = 10rem = 160px
  const nodeHeight = 140 // approximate height of person card
  
  dagreGraph.setGraph({ 
    rankdir: direction,
    nodesep: 200,  // horizontal spacing between nodes
    ranksep: 150,  // vertical spacing between generations
    marginx: 100,
    marginy: 50,
  })

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight })
  })

  // Only add parent-child edges to Dagre (not partnerships)
  // This ensures proper hierarchical layout
  const parentChildEdges = edges.filter(e => e.type !== 'straight')
  parentChildEdges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target)
  })

  dagre.layout(dagreGraph)

  // Get initial positions from Dagre
  let layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id)
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    }
  })

  // Post-process: Place partners side-by-side
  const partnerOffset = 180 // How far apart partners should be
  const processedIds = new Set<string>()
  
  layoutedNodes = layoutedNodes.map((node) => {
    if (processedIds.has(node.id)) return node
    
    const person = familyData.find(p => p.id === node.id)
    if (person?.partnerId) {
      const partnerNode = layoutedNodes.find(n => n.id === person.partnerId)
      if (partnerNode) {
        // Place them side-by-side at the same y-level
        // Average their x positions and spread them out
        const avgX = (node.position.x + partnerNode.position.x) / 2
        const avgY = Math.min(node.position.y, partnerNode.position.y) // Use the higher (lower y) position
        
        node.position = {
          x: avgX - partnerOffset / 2,
          y: avgY,
        }
        partnerNode.position = {
          x: avgX + partnerOffset / 2,
          y: avgY,
        }
        
        processedIds.add(node.id)
        processedIds.add(person.partnerId)
      }
    }
    
    return node
  })

  return { nodes: layoutedNodes, edges }
}

// Generate nodes and edges from family data
const generateFamilyTree = () => {
  const nodes: Node<PersonData>[] = familyData.map((person) => ({
    id: person.id,
    type: 'person',
    position: { x: 0, y: 0 }, // Will be calculated by dagre
    data: {
      ...person,
      color: getPersonColor(person.id),
    },
  }))

  const edges: Edge[] = []
  
  // Create partnership edges (horizontal connections)
  const partnerships = new Set<string>()
  familyData.forEach((person) => {
    if (person.partnerId && !partnerships.has(`${person.partnerId}-${person.id}`)) {
      partnerships.add(`${person.id}-${person.partnerId}`)
      edges.push({
        id: `e${person.id}-${person.partnerId}`,
        source: person.id,
        target: person.partnerId,
        sourceHandle: 'right',
        targetHandle: 'left',
        type: 'straight',
        style: { 
          stroke: 'oklch(0.577 0.245 27.325)', 
          strokeWidth: 3, 
          strokeDasharray: '5,5' 
        },
      })
    }
  })
  
  // Create parent-child edges
  familyData.forEach((person) => {
    if (person.parents) {
      person.parents.forEach((parentId) => {
        edges.push({
          id: `e${parentId}-${person.id}`,
          source: parentId,
          target: person.id,
          type: 'smoothstep',
          style: { 
            stroke: 'oklch(0.52 0.123 42.70)', 
            strokeWidth: 2.5 
          },
        })
      })
    }
  })

  return getLayoutedElements(nodes, edges)
}

function FamilyTree() {
  const [selectedPerson, setSelectedPerson] = useState<PersonData | null>(null)
  
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => generateFamilyTree(), [])

  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedPerson(node.data as PersonData)
  }, [])

  return (
    <>
      {/* Family Tree Canvas - Full Screen */}
      <div className="fixed inset-0 top-20 bg-card">
        <div className="h-full w-full [&_.react-flow\_\_edges]:z-\[1\] [&_.react-flow\_\_nodes]:z-\[2\]">
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
            fitViewOptions={{ padding: 0.05, maxZoom: 1.2 }}
            minZoom={0.5}
            maxZoom={2}
            defaultEdgeOptions={{
              style: { strokeWidth: 3, stroke: 'oklch(0.52 0.123 42.70)' },
            }}
            proOptions={{ hideAttribution: true }}
          >
            <Controls
              position="top-right"
              className="bg-card/90 border-2 border-border rounded-lg shadow-md [&_button]:bg-card [&_button]:border-input [&_button]:text-card-foreground [&_button:hover]:bg-muted [&_button]:transition-all"
              showInteractive={false}
            />
          </ReactFlow>
        </div>

      </div>

      {/* Person Detail Modal */}
      {selectedPerson && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card shadow-2xl max-w-md w-full p-8 border-t-8 border-primary rounded-lg">
            <div
              className="w-20 h-20 flex items-center justify-center mb-6 mx-auto rounded-md"
              style={{ backgroundColor: selectedPerson.color }}
            >
              <User className="w-10 h-10 text-primary-foreground" />
            </div>

            <Heading level="h3" className="mb-2 text-center">
              {selectedPerson.name}
            </Heading>

            <div className="space-y-3 mb-8">
              <div className="bg-muted p-4 border-l-4 border-chart-5 rounded">
                <div className="text-sm text-muted-foreground mb-1 uppercase tracking-wide">
                  Født
                </div>
                <div className="text-lg font-semibold text-foreground">
                  {selectedPerson.birth}
                </div>
              </div>

              {selectedPerson.death && (
                <div className="bg-muted p-4 border-l-4 border-border rounded">
                  <div className="text-sm text-muted-foreground mb-1 uppercase tracking-wide">
                    Død
                  </div>
                  <div className="text-lg font-semibold text-foreground">
                    {selectedPerson.death}
                  </div>
                </div>
              )}

              {selectedPerson.partnerId && (
                <div className="bg-muted p-4 border-l-4 border-destructive rounded">
                  <div className="text-sm text-muted-foreground mb-1 flex items-center gap-2 uppercase tracking-wide">
                    <Heart className="w-4 h-4" />
                    Partner
                  </div>
                  <div className="text-lg font-semibold text-foreground">
                    {
                      familyData.find(
                        (p) => p.id === selectedPerson.partnerId,
                      )?.name
                    }
                  </div>
                </div>
              )}
            </div>

            <Button
              onClick={() => setSelectedPerson(null)}
              className="w-full"
            >
              Lukk
            </Button>
          </div>
        </div>
      )}
    </>
  )
}

export const Route = createFileRoute('/slektstre/')({
  component: FamilyTree,
})
