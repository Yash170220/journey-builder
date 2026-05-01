import type { BlueprintGraph } from '@/types/graph';


export const fixtureGraph: BlueprintGraph = {
  id: 'bp_456',
  name: 'Onboarding (demo)',
  description: 'Demo blueprint — runs without the backend.',
  nodes: [
    {
      id: 'form-a',
      type: 'form',
      position: { x: 80, y: 200 },
      data: {
        id: 'form-a',
        component_key: 'form-a',
        component_type: 'form',
        component_id: 'f_a',
        name: 'Form A',
        prerequisites: [],
      },
    },
    {
      id: 'form-b',
      type: 'form',
      position: { x: 380, y: 80 },
      data: {
        id: 'form-b',
        component_key: 'form-b',
        component_type: 'form',
        component_id: 'f_b',
        name: 'Form B',
        prerequisites: ['form-a'],
      },
    },
    {
      id: 'form-c',
      type: 'form',
      position: { x: 380, y: 320 },
      data: {
        id: 'form-c',
        component_key: 'form-c',
        component_type: 'form',
        component_id: 'f_c',
        name: 'Form C',
        prerequisites: ['form-a'],
      },
    },
    {
      id: 'form-d',
      type: 'form',
      position: { x: 700, y: 200 },
      data: {
        id: 'form-d',
        component_key: 'form-d',
        component_type: 'form',
        component_id: 'f_d',
        name: 'Form D',
        prerequisites: ['form-b', 'form-c'],
      },
    },
  ],
  edges: [
    { source: 'form-a', target: 'form-b' },
    { source: 'form-a', target: 'form-c' },
    { source: 'form-b', target: 'form-d' },
    { source: 'form-c', target: 'form-d' },
  ],
  forms: [
    {
      id: 'f_a',
      name: 'Form A',
      field_schema: {
        type: 'object',
        properties: {
          name: { type: 'string', title: 'Name' },
          email: { type: 'string', title: 'Email', format: 'email' },
        },
        required: ['name', 'email'],
      },
    },
    {
      id: 'f_b',
      name: 'Form B',
      field_schema: {
        type: 'object',
        properties: {
          dob: { type: 'string', title: 'Date of birth', format: 'date' },
          phone: { type: 'string', title: 'Phone' },
        },
      },
    },
    {
      id: 'f_c',
      name: 'Form C',
      field_schema: {
        type: 'object',
        properties: {
          ssn: { type: 'string', title: 'SSN' },
          address: { type: 'string', title: 'Address' },
        },
      },
    },
    {
      id: 'f_d',
      name: 'Form D',
      field_schema: {
        type: 'object',
        properties: {
          dynamic_checkbox_group: {
            type: 'array',
            title: 'dynamic_checkbox_group',
            items: { type: 'string' },
          },
          dynamic_object: { type: 'object', title: 'dynamic_object' },
          email: { type: 'string', title: 'email', format: 'email' },
          confirm: { type: 'boolean', title: 'Confirm' },
        },
        required: ['email'],
      },
    },
  ],
};
