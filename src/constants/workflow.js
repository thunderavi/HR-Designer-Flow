export const NODE_TYPES = {
  START: 'startNode',
  TASK: 'taskNode',
  APPROVAL: 'approvalNode',
  AUTOMATED_STEP: 'automatedStepNode',
  END: 'endNode',
  CUSTOM: 'customNode',
};

export const INITIAL_NODES = [
  {
    id: 'start-1',
    type: NODE_TYPES.START,
    position: { x: 250, y: 100 },
    data: { label: 'Start Workflow', title: 'New Employee Onboarding' },
  },
];
