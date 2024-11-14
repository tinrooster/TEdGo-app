Broadcast Engineering Documentation System (BEDS)
Project Specification and Implementation Plan
1. Project Overview
1.1 Purpose
Create a comprehensive mobile-first web application suite to manage and access broadcast engineering documentation, focusing on cable management, equipment locations, and system diagrams. The system will serve as a critical operational tool for engineering staff during both routine maintenance and emergency situations.
1.2 Core Components

Cable Database Interface
Drawing Viewer
Equipment Location System
Note Taking & Documentation
Offline Capability
QR/Label Scanning

2. Data Structure
2.1 Cable Database
Copy- NUMBER (Primary Key)
- DWG (Drawing Reference)
- ORIGIN (Source device/location)
- DEST (Destination device/location)
- Alt DWG (Alternative drawing reference)
- Wire Type (Cable specification)
- Length
- Note
- ProjectID
2.2 Drawing Organization
Copy- Master Control (7.xx series)
- Current Systems (22000-22999)
- Legacy Systems (0-16999, 17000-20999, 21000-21999)
- Excel Drawing Index
2.3 Location Structure
Copy- Master Control: CA01-CA04, CB01-CB04
- TE Room Rows:
  * TX (01-17): MDF Panels
  * TC (01-13): Studio Systems
  * TD (01-13): RF/Distribution
  * TE (01-13): Satellite
  * TF (01-12): RF Modulators
  * TG (01-12): Old Master Control
  * TH (01-11): Control Room Audio/Tally
  * TJ (01-10): Router/DA/Evertz
  * TK (01-10): Streaming
2.4 Signal Types & Standards
Copy- Video: 
  * Yellow jacketed
  * Belden 1855A (primary)
  * Belden 1694A (long runs)
  * Belden 1505A (less frequent)

- Audio/Network:
  * Blue jacketed
  * Cat6 UTP Belden 2412 CMRO

- Sync/Reference:
  * Black BNC

- Control/GPIO:
  * Green, Black, Gray
  * Belden 9451

- Fiber:
  * Single Mode
  * Multi Mode (OM4)
  * Connectors: LC, MTP/MPO, ST
3. Technical Requirements
3.1 Frontend Stack
javascriptCopy{
  "dependencies": {
    "next": "^14.x",
    "react": "^18.x",
    "react-dom": "^18.x",
    "@tanstack/react-query": "^5.x",
    "tailwindcss": "^3.x",
    "lucide-react": "^0.263.1",
    "shadcn/ui": "latest",
    "@react-pdf-viewer/core": "^3.x",
    "react-zoom-pan-pinch": "^3.x",
    "tesseract.js": "^4.x",
    "html5-qrcode": "^2.x",
    "idb": "^7.x",
    "pdfjs-dist": "^3.x",
    "papaparse": "^5.x",
    "lodash": "^4.x"
  }
}
3.2 Database Schema
prismaCopymodel Cable {
  id          String   @id @default(cuid())
  number      String   @unique
  drawing     String
  origin      String
  destination String
  altDrawing  String?
  wireType    String?
  length      String?
  note        String?
  projectId   String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Drawing {
  id          String   @id @default(cuid())
  number      String   @unique
  path        String
  description String?
  category    String?
  lastAccessed DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Note {
  id        String   @id @default(cuid())
  title     String
  content   String
  images    Image[]
  cables    Cable[]
  userId    String
  deviceId  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
4. Core Features
4.1 Cable Management

Quick search across all fields
Batch lookup by device/location
QR/Label scanning
Signal path tracing
Redundancy group tracking (D1/D2 Primary/Backup, E-list)

4.2 Drawing Viewer

Pan/Zoom controls
Layer management (Video, Audio, Sync, Control)
Signal type color coding
Measurement tools
Quick device search
Drawing version comparison
Cross-reference support
Offline caching

4.3 Note Taking

Photo attachment
Cable/Drawing linking
Local storage
Share capability
Troubleshooting templates
Follow-up tracking

4.4 Offline Functionality

Critical data caching
Recent drawing storage
Sync queue for updates
Network status indicator
Background sync

5. Implementation Phases
Phase 1: Foundation

Project setup with Next.js
Basic UI components
Database schema implementation
Core routing and navigation
Authentication setup

Phase 2: Cable Database

Search interface
Cable data display
Quick lookup tools
Basic scanning interface
Location filtering

Phase 3: Drawing Viewer

Basic viewer implementation
Layer management
Navigation tools
Drawing caching
Version management

Phase 4: Enhanced Features

Note taking system
Offline capability
Sync mechanism
Enhanced scanning
Batch operations

Phase 5: Integration & Polish

Cross-feature linking
Performance optimization
Enhanced offline support
User feedback implementation
Final testing and deployment

6. Key Considerations
6.1 Performance

Efficient drawing loading
Smart caching strategy
Optimized search indexing
Minimal network usage

6.2 Usability

Large touch targets
High contrast interface
Quick access patterns
Clear status indicators
Error prevention

6.3 Reliability

Offline-first approach
Data consistency
Error recovery
Sync validation
Backup mechanisms

7. Integration Points
7.1 Existing Systems

Excel/Access database import
AutoCAD LT drawing access
Network drive connectivity
Future SQL migration path

7.2 Future Expansion

Equipment inventory
Maintenance scheduling
Change tracking
Asset management
Work order integration