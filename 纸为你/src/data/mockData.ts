import type {
  Building,
  Toilet,
  FeedbackTicket,
  SensorIssue,
  EmergencyContact,
  Device,
} from '../types';

export const mockBuildings: Building[] = [
  {
    id: 'b1',
    name: '教学楼A',
    location: '校园中心区域',
    floors: 5,
    coordinates: { lat: 31.825678, lng: 117.195265 },
  },
  {
    id: 'b2',
    name: '图书馆',
    location: '校园东侧',
    floors: 4,
    coordinates: { lat: 31.826678, lng: 117.196265 },
  },
  {
    id: 'b3',
    name: '学生食堂',
    location: '校园北门',
    floors: 3,
    coordinates: { lat: 31.824678, lng: 117.194265 },
  },
  {
    id: 'b4',
    name: '行政楼',
    location: '校园西门',
    floors: 6,
    coordinates: { lat: 31.825178, lng: 117.193765 },
  },
];

export const mockToilets: Toilet[] = [
  {
    toiletId: 't1',
    buildingId: 'b1',
    buildingName: '教学楼A',
    floor: 1,
    type: 'female',
    coordinates: { lat: 31.825678, lng: 117.195265 },
    initialWeight: 500,
    currentWeight: 420,
    status: 'sufficient',
    lastUpdated: new Date(Date.now() - 300000),
    deviceId: 'd1',
  },
  {
    toiletId: 't2',
    buildingId: 'b1',
    buildingName: '教学楼A',
    floor: 1,
    type: 'male',
    coordinates: { lat: 31.825688, lng: 117.195275 },
    initialWeight: 500,
    currentWeight: 85,
    status: 'insufficient',
    lastUpdated: new Date(Date.now() - 600000),
    deviceId: 'd2',
  },
  {
    toiletId: 't3',
    buildingId: 'b1',
    buildingName: '教学楼A',
    floor: 2,
    type: 'female',
    coordinates: { lat: 31.825698, lng: 117.195285 },
    initialWeight: 500,
    currentWeight: 0,
    status: 'maintenance',
    lastUpdated: new Date(Date.now() - 7200000),
    deviceId: 'd3',
  },
  {
    toiletId: 't4',
    buildingId: 'b2',
    buildingName: '图书馆',
    floor: 1,
    type: 'female',
    coordinates: { lat: 31.826678, lng: 117.196265 },
    initialWeight: 500,
    currentWeight: 380,
    status: 'sufficient',
    lastUpdated: new Date(Date.now() - 420000),
    deviceId: 'd4',
  },
  {
    toiletId: 't5',
    buildingId: 'b2',
    buildingName: '图书馆',
    floor: 1,
    type: 'male',
    coordinates: { lat: 31.826688, lng: 117.196275 },
    initialWeight: 500,
    currentWeight: 95,
    status: 'insufficient',
    lastUpdated: new Date(Date.now() - 480000),
    deviceId: 'd5',
  },
  {
    toiletId: 't6',
    buildingId: 'b3',
    buildingName: '学生食堂',
    floor: 1,
    type: 'female',
    coordinates: { lat: 31.824678, lng: 117.194265 },
    initialWeight: 500,
    currentWeight: 450,
    status: 'sufficient',
    lastUpdated: new Date(Date.now() - 360000),
    deviceId: 'd6',
  },
  {
    toiletId: 't7',
    buildingId: 'b3',
    buildingName: '学生食堂',
    floor: 1,
    type: 'male',
    coordinates: { lat: 31.824688, lng: 117.194275 },
    initialWeight: 500,
    currentWeight: 30,
    status: 'insufficient',
    lastUpdated: new Date(Date.now() - 300000),
    deviceId: 'd7',
  },
  {
    toiletId: 't8',
    buildingId: 'b4',
    buildingName: '行政楼',
    floor: 1,
    type: 'accessible',
    coordinates: { lat: 31.825178, lng: 117.193765 },
    initialWeight: 500,
    currentWeight: 400,
    status: 'sufficient',
    lastUpdated: new Date(Date.now() - 540000),
    deviceId: 'd8',
  },
];

export const mockDevices: Device[] = mockToilets.map((toilet) => ({
  deviceId: toilet.deviceId || `d-${toilet.toiletId}`,
  toiletId: toilet.toiletId,
  deviceStatus: toilet.status === 'maintenance' ? 'maintenance' : 'online',
  batteryLevel: Math.floor(Math.random() * 60) + 40,
  lastHeartbeat: toilet.lastUpdated,
  firmwareVersion: 'v2.1.0',
  installedAt: new Date(Date.now() - 365 * 24 * 3600000),
}));

export const mockFeedbackTickets: FeedbackTicket[] = [
  {
    ticketId: 1,
    toiletId: 't2',
    toiletInfo: mockToilets.find((t) => t.toiletId === 't2'),
    userType: 'student',
    problemType: 'empty',
    description: '卫生纸已经完全用完,急需补充',
    ticketStatus: 'submitted',
    createdAt: new Date(Date.now() - 1800000),
    isDeleted: false,
  },
  {
    ticketId: 2,
    toiletId: 't5',
    toiletInfo: mockToilets.find((t) => t.toiletId === 't5'),
    userType: 'staff',
    problemType: 'empty',
    description: '男卫生间卫生纸几乎没有了',
    ticketStatus: 'verified',
    createdAt: new Date(Date.now() - 7200000),
    isDeleted: false,
  },
  {
    ticketId: 3,
    toiletId: 't3',
    toiletInfo: mockToilets.find((t) => t.toiletId === 't3'),
    userType: 'anonymous',
    problemType: 'malfunction',
    description: '传感器设备异常,无法检测状态',
    ticketStatus: 'resolved',
    createdAt: new Date(Date.now() - 86400000),
    resolvedAt: new Date(Date.now() - 43200000),
    isDeleted: false,
  },
];

export const mockSensorIssues: SensorIssue[] = [
  {
    id: 'si1',
    toiletId: 't3',
    bathroomLocation: '教学楼A - 2楼 - 女卫生间',
    issue: '传感器连续3次上报重量异常(为零)',
    detectedAt: new Date(Date.now() - 7200000),
    deviceId: 'd3',
    batteryLevel: 15,
  },
  {
    id: 'si2',
    toiletId: 't7',
    bathroomLocation: '学生食堂 - 1楼 - 男卫生间',
    issue: '电池电量低于20%,需及时更换',
    detectedAt: new Date(Date.now() - 600000),
    deviceId: 'd7',
    batteryLevel: 18,
  },
];

export const mockEmergencyContacts: EmergencyContact[] = [
  {
    id: 'ec1',
    name: '张师傅',
    phone: '13855123456',
    role: '保洁主管',
    building: '教学楼A',
  },
  {
    id: 'ec2',
    name: '李师傅',
    phone: '13955123456',
    role: '设备维修',
  },
  {
    id: 'ec3',
    name: '王老师',
    phone: '13755123456',
    role: '后勤负责人',
  },
];

export function getInsufficientToilets(): Toilet[] {
  return mockToilets.filter((t) => t.status === 'insufficient');
}

export function getToiletsByBuilding(buildingId: string): Toilet[] {
  return mockToilets.filter((t) => t.buildingId === buildingId);
}

export function getBuildingById(buildingId: string): Building | undefined {
  return mockBuildings.find((b) => b.id === buildingId);
}

export function getSensorIssues(): SensorIssue[] {
  return mockSensorIssues;
}

export function getFeedbackTickets(): FeedbackTicket[] {
  return mockFeedbackTickets.filter((t) => !t.isDeleted);
}

export function getFeedbackTicketById(ticketId: number): FeedbackTicket | undefined {
  return mockFeedbackTickets.find((t) => t.ticketId === ticketId);
}

export function getInsufficientCount(): number {
  return mockToilets.filter((t) => t.status === 'insufficient').length;
}

export function getMaintenanceCount(): number {
  return mockToilets.filter((t) => t.status === 'maintenance').length;
}