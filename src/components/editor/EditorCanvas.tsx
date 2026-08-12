import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import {
  Stage,
  Layer,
  Rect,
  Circle,
  Line,
  Text,
  Group,
  Star,
  Transformer,
  Image as KonvaImage,
} from 'react-konva'
import type Konva from 'konva'
import type { Node } from 'konva/lib/Node'
import type { KonvaEventObject } from 'konva/lib/Node'
import type { Template, TextElement, ShapeElement, DecorationElement, ImageElement } from '../../lib/template-validator'
import type { TemplateProject } from '../../lib/template-engine'

type SelectedElement = { key: string; node: Node }

type EditorCanvasProps = {
  template: Template
  project: TemplateProject
  selectedKey: string | null
  onSelect: (key: string | null) => void
  onUpdateElement: (key: string, patch: Partial<Pick<Template['elements'][number], 'x' | 'y' | 'width' | 'height' | 'rotation'>>) => void
  onStageReady: (stage: Konva.Stage) => void
  scale: number
}

type NodeClickHandler = (node: Node) => void
type KonvaMouseEvent = KonvaEventObject<MouseEvent | TouchEvent>

function useLoadedImage(src: string): HTMLImageElement | null {
  const [img, setImg] = useState<HTMLImageElement | null>(null)
  useEffect(() => {
    const image = new window.Image()
    image.src = src
    image.onload = () => setImg(image)
    return () => {
      image.onload = null
    }
  }, [src])
  return img
}

function ImageElementRenderer({
  el,
  keyName,
  project,
  onClick,
}: {
  el: ImageElement
  keyName: string
  project: TemplateProject
  onClick: NodeClickHandler
}) {
  const imageSrc = project.images[keyName]
  const loadedImage = imageSrc ? useLoadedImage(imageSrc) : null
  const width = el.width ?? 100
  const height = el.height ?? 100

  return (
    <Group
      id={keyName}
      name={keyName}
      x={el.x ?? 0}
      y={el.y ?? 0}
      rotation={el.rotation ?? 0}
      visible={el.visible ?? true}
      onClick={(e) => onClick(e.target)}
      onTap={(e) => onClick(e.target)}
    >
      <Rect width={width} height={height} fill="#d1d5db" cornerRadius={el.borderRadius} />
      {loadedImage ? (
        <KonvaImage image={loadedImage} width={width} height={height} cornerRadius={el.borderRadius} />
      ) : (
        <Text text={el.alt ?? 'Image placeholder'} width={width} height={height} align="center" verticalAlign="middle" fontSize={Math.min(20, width / 8)} fill="#6b7280" listening={false} />
      )}
    </Group>
  )
}

function getElementValue(element: TextElement, project: TemplateProject): string {
  if (!element.editable) return element.default ?? ''
  return project.values[element.key] ?? element.default ?? ''
}

function renderShape(el: ShapeElement, key: string, selected: boolean, onClick: NodeClickHandler) {
  const common = {
    key,
    x: el.x ?? 0,
    y: el.y ?? 0,
    rotation: el.rotation ?? 0,
    visible: el.visible ?? true,
    stroke: el.stroke,
    strokeWidth: el.strokeWidth,
    onClick: (e: KonvaMouseEvent) => onClick(e.target),
    onTap: (e: KonvaMouseEvent) => onClick(e.target),
  }
  if (el.shapeType === 'circle') return <Circle {...common} width={el.width} height={el.height} fill={selected ? 'rgba(59, 130, 246, 0.4)' : el.fill} />
  if (el.shapeType === 'line') return <Line {...common} points={el.width ? [0, 0, el.width, 0] : [0, 0, 100, 0]} stroke={el.stroke ?? el.fill ?? '#000000'} strokeWidth={el.strokeWidth ?? 4} />
  return <Rect {...common} width={el.width} height={el.height} cornerRadius={el.cornerRadius ?? 0} fill={selected ? 'rgba(59, 130, 246, 0.4)' : el.fill} />
}

function renderDecoration(el: DecorationElement, key: string, onClick: NodeClickHandler) {
  const size = el.size ?? 40
  const base = {
    key,
    x: el.x ?? 0,
    y: el.y ?? 0,
    rotation: el.rotation ?? 0,
    visible: el.visible ?? true,
    onClick: (e: KonvaMouseEvent) => onClick(e.target),
    onTap: (e: KonvaMouseEvent) => onClick(e.target),
  }
  switch (el.kind) {
    case 'circle': return <Circle {...base} radius={size / 2} fill={el.color ?? '#000000'} />
    case 'diamond': return <Rect {...base} width={size} height={size} rotation={(el.rotation ?? 0) + 45} fill={el.color ?? '#000000'} />
    default: return <Star {...base} numPoints={5} innerRadius={size / 2.5} outerRadius={size / 2} fill={el.color ?? '#000000'} />
  }
}

export default function EditorCanvas({ template, project, selectedKey, onSelect, onUpdateElement, onStageReady, scale }: EditorCanvasProps) {
  const stageRef = useRef<Konva.Stage | null>(null)
  const transformerRef = useRef<Konva.Transformer | null>(null)
  const selectedRef = useRef<SelectedElement | null>(null)

  const handleSelect = (elKey: string, node: Node) => {
    selectedRef.current = { key: elKey, node }
    onSelect(elKey)
    transformerRef.current?.nodes([node])
    transformerRef.current?.getLayer()?.batchDraw()
  }

  const handleDeselect = () => {
    selectedRef.current = null
    onSelect(null)
    transformerRef.current?.nodes([])
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') handleDeselect()
    if ((e.key === 'Delete' || e.key === 'Backspace') && selectedRef.current) handleDeselect()
  }

  return (
    <div className="relative overflow-hidden rounded shadow-lg focus:outline-none" style={{ width: template.canvas.width * scale, height: template.canvas.height * scale }} onKeyDown={handleKeyDown} role="img" aria-label={template.name} tabIndex={0}>
      <Stage
        ref={(stage) => {
          if (stage && !stageRef.current) {
            stageRef.current = stage
            onStageReady(stage)
          }
        }}
        width={template.canvas.width}
        height={template.canvas.height}
        scaleX={scale}
        scaleY={scale}
        onMouseDown={(e) => { if (e.target === e.target.getStage()) handleDeselect() }}
        onTouchStart={(e) => { if (e.target === e.target.getStage()) handleDeselect() }}
      >
        <Layer>
          {template.background?.fill && <Rect key="bg-fill" width={template.canvas.width} height={template.canvas.height} fill={template.background.fill} />}
          {template.elements.map((el) => {
            const key = el.key
            const selected = selectedKey === key
            const onClick: NodeClickHandler = (node) => handleSelect(key, node)
            if (el.type === 'text') {
              return (
                <Text
                  key={key}
                  id={key}
                  name={key}
                  text={getElementValue(el, project)}
                  x={el.x ?? 0}
                  y={el.y ?? 0}
                  width={el.width}
                  height={el.height}
                  rotation={el.rotation ?? 0}
                  visible={el.visible ?? true}
                  fontSize={el.fontSize}
                  fontFamily={el.fontFamily}
                  fontStyle={el.fontWeight === 'bold' ? 'bold' : 'normal'}
                  fill={selected ? '#3b82f6' : el.fill}
                  align={el.align ?? 'left'}
                  lineHeight={el.lineHeight}
                  onClick={(e) => onClick(e.target)}
                  onTap={(e) => onClick(e.target)}
                  draggable={el.editable || el.x !== undefined}
                  onDragEnd={(e) => onUpdateElement(key, { x: e.target.x(), y: e.target.y() })}
                  onTransformEnd={(e) => {
                    const node = e.target
                    onUpdateElement(key, { x: node.x(), y: node.y(), rotation: node.rotation(), width: node.width() * node.scaleX(), height: node.height() * node.scaleY() })
                    node.scaleX(1)
                    node.scaleY(1)
                  }}
                />
              )
            }
            if (el.type === 'shape') return renderShape(el, key, selected, onClick)
            if (el.type === 'decoration') return renderDecoration(el, key, onClick)
            return <ImageElementRenderer key={key} el={el} keyName={key} project={project} onClick={onClick} />
          })}
          <Transformer ref={transformerRef} rotateEnabled={false} keepRatio={false} enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']} boundBoxFunc={(oldBox, newBox) => newBox.width < 10 || newBox.height < 10 ? oldBox : newBox} />
        </Layer>
      </Stage>
    </div>
  )
}
