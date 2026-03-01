import React from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface SortableListProps<T> {
    items: T[];
    onReorder: (items: T[]) => void;
    renderItem: (item: T) => React.ReactNode;
    idField?: keyof T;
    className?: string;
    strategy?: any;
}

export function SortableList<T extends { id?: number | string }>({
    items,
    onReorder,
    renderItem,
    idField = 'id',
    className = "space-y-4",
    strategy = rectSortingStrategy,
}: SortableListProps<T>) {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex((item) => String(item[idField]) === String(active.id));
            const newIndex = items.findIndex((item) => String(item[idField]) === String(over.id));

            onReorder(arrayMove(items, oldIndex, newIndex));
        }
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={items.map((item) => String(item[idField]))}
                strategy={strategy}
            >
                <div className={className}>
                    {items.map((item) => (
                        <SortableItem key={String(item[idField])} id={String(item[idField])}>
                            {renderItem(item)}
                        </SortableItem>
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}

interface SortableItemProps {
    id: string;
    children: React.ReactNode;
}

function SortableItem({ id, children }: SortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 0,
        position: 'relative' as const,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`${isDragging ? 'opacity-50' : ''} group relative`}
        >
            <div
                {...attributes}
                {...listeners}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 cursor-grab active:cursor-grabbing text-neutral-300 hover:text-accent opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
                <GripVertical size={20} />
            </div>
            <div className="pl-10">
                {children}
            </div>
        </div>
    );
}
