import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Clock, 
  TrendingUp,
  ArrowRight,
  GripVertical
} from 'lucide-react';
import { Button } from '../components/Button';
import { Card, CardHeader, CardContent } from '../components/Card';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../lib/api';
import { toast } from 'sonner';
import { cn } from '../lib/utils';

import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const PIPELINE_STAGES = [
  { id: 'interested', label: 'Initial Interest', color: 'bg-blue-500' },
  { id: 'discovery', label: 'Due Diligence', color: 'bg-purple-500' },
  { id: 'funding', label: 'Funding Call', color: 'bg-orange-500' },
  { id: 'closed', label: 'Closed / Active', color: 'bg-green-500' },
];

// --- Sub-components ---

const SortableCard = ({ interest, isDragging = false }: { interest: any, isDragging?: boolean }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: interest.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className="border-neutral-100 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing overflow-hidden group">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-neutral-900 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                {interest.startup.name[0]}
              </div>
              <div>
                <h4 className="font-bold text-neutral-900 text-sm">{interest.startup.name}</h4>
                <p className="text-[10px] text-neutral-500">{interest.startup.industry}</p>
              </div>
            </div>
            <GripVertical className="w-4 h-4 text-neutral-300 group-hover:text-neutral-500 transition-colors" />
          </div>
          
          <div className="pt-2 border-t border-neutral-50 flex items-center justify-between text-[10px] font-bold text-neutral-400">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{new Date(interest.created_at).toLocaleDateString()}</span>
            </div>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const InvestorFundingPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeId, setActiveId] = useState<any>(null);
  const [localInterests, setLocalInterests] = useState<any[]>([]);

  const [activeStage, setActiveStage] = useState('interested');
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

  const { data: interests, isLoading } = useQuery({
    queryKey: ['investor-interests'],
    queryFn: async () => {
      const response = await apiClient.get('/investments/interests');
      return response.data.data;
    }
  });

  useEffect(() => {
    if (interests) setLocalInterests(interests);
  }, [interests]);

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: string }) => {
      return apiClient.post('/investments/update-status', { 
        interest_id: id, 
        status 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investor-interests'] });
      toast.success('Deal pipeline updated');
    },
    onError: () => {
      setLocalInterests(interests || []); // Revert on error
      toast.error('Failed to move deal');
    }
  });

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event: any) => {
    const { active, over } = event;
    if (!over) return;

    const activeItem = localInterests.find(i => i.id === active.id);
    const overId = over.id;

    // Check if dropping over a column or another card
    const isOverAColumn = PIPELINE_STAGES.some(s => s.id === overId);
    
    if (isOverAColumn) {
      const targetStatus = overId;
      if (activeItem.status !== targetStatus) {
        setLocalInterests(prev => prev.map(item => 
          item.id === active.id ? { ...item, status: targetStatus } : item
        ));
      }
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeItem = localInterests.find(i => i.id === active.id);
    const targetStatus = PIPELINE_STAGES.some(s => s.id === over.id) 
      ? over.id 
      : localInterests.find(i => i.id === over.id)?.status;

    if (activeItem && targetStatus && activeItem.status !== targetStatus) {
      updateStatusMutation.mutate({ id: activeItem.id, status: targetStatus });
    }
  };

  const activeItem = activeId ? localInterests.find(i => i.id === activeId) : null;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-neutral-900 tracking-tight mb-2">Deal Pipeline</h1>
          <p className="text-neutral-500">Drag and drop startups to manage your investment workflow.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="w-4 h-4" /> Filter
          </Button>
          <Button size="sm" className="gap-2">
            <Search className="w-4 h-4" /> Find Deals
          </Button>
        </div>
      </div>


      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {/* Mobile Stage Selector */}
        <div className="lg:hidden flex overflow-x-auto gap-2 pb-4 no-scrollbar">
          {PIPELINE_STAGES.map((stage) => (
            <button
              key={stage.id}
              onClick={() => setActiveStage(stage.id)}
              className={cn(
                "flex-none px-4 py-2 rounded-full text-xs font-bold transition-all border whitespace-nowrap cursor-pointer",
                activeStage === stage.id 
                  ? "bg-neutral-900 text-white border-neutral-900 shadow-md" 
                  : "bg-white text-neutral-500 border-neutral-200"
              )}
            >
              {stage.label} ({localInterests.filter(i => i.status === stage.id).length})
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[600px]">
          {PIPELINE_STAGES.map((stage) => (
            <div 
              key={stage.id} 
              className={cn(
                "flex flex-col gap-4 transition-all duration-300",
                "hidden lg:flex", // Desktop always shows all
                activeStage === stage.id && "flex" // Mobile shows active
              )}
            >
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${stage.color}`} />
                  <h3 className="font-bold text-sm text-neutral-900 uppercase tracking-widest">{stage.label}</h3>
                  <span className="text-xs font-bold text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">
                    {localInterests.filter(i => i.status === stage.id).length}
                  </span>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>

              {/* Droppable Container */}
              <SortableContext
                id={stage.id}
                items={localInterests.filter(i => i.status === stage.id).map(i => i.id)}
                strategy={verticalListSortingStrategy}
              >
                <div 
                  className="flex-1 bg-neutral-50/50 rounded-2xl p-3 border border-neutral-100 space-y-4 transition-colors min-h-[200px]"
                >
                  {isLoading ? (
                    <div className="p-4 text-center text-xs text-neutral-400 animate-pulse">Loading deals...</div>
                  ) : (
                    localInterests
                      .filter(i => i.status === stage.id)
                      .map((interest) => (
                        <SortableCard key={interest.id} interest={interest} />
                      ))
                  )}
                  
                  {!isLoading && localInterests.filter(i => i.status === stage.id).length === 0 && (
                    <div className="h-24 flex flex-col items-center justify-center border-2 border-dashed border-neutral-200 rounded-2xl opacity-50">
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Empty Stage</p>
                    </div>
                  )}
                </div>
              </SortableContext>
            </div>
          ))}
        </div>

        <DragOverlay dropAnimation={{
          sideEffects: defaultDropAnimationSideEffects({
            styles: {
              active: {
                opacity: '0.5',
              },
            },
          }),
        }}>
          {activeItem ? (
            <div className="scale-105 rotate-2 shadow-2xl">
              <SortableCard interest={activeItem} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
