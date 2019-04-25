# Markings Work Orders - Data Tracker module <h1> 

## Stakeholders <h2>
- Markings technicians
- Signs and Markings Internal Staff
- Transportation Engineers

## Object tables <h2>
- **work_orders_signs_markings:** *signs/markings work order records*
- **work_orders_signs_markings_attachments:** signs/markings attachment records
- **work_orders_signs_markings_comments:** signs/markings comment records
- **work_orders_signs_markings_specifications:** list of signs/markings specification types
- **work_orders_signs_markings_specification_actuals:** signs/markings specifications used on work orders
- **work_orders_signs_markings_jobs:** signs/markings jobs (child record) of "work_order_signs/markings" (parent record)
- **work_orders_signs_markings_time_log:** signs/markings labor records (time spent on job site)
- **fleet_vehicles:** list of atd vehicles used in work orders
- **inventory_items:** list of inventory items (organized by work group)
- **inventory_transactions:** transaction records of each time material was used on a work order

## Relationships <h2>
- **work_order_signs_markings** (Parent record) --> creates **work_order_signs_markings_jobs** (Child record)
for each work group associated on a work order

- **work_order_signs_markings** has multiple relationships
connected to: (tables that allow a technician to enter "Actuals")
  - attachments
  - comments
  - specifications
  - actuals
  - time log
  - fleet vehicles
  - inventory items
  - inventory transactions 

## Business Rules Explained <h2>

A work order can be "Cancelled" in a "Need To Be Issued" status, once it passes this status and is in the "Issued" status then the work order cannot be "Cancelled" unless you are in a specific role.

**Cancelling Attachments**: Staff asked that engineers not be able to delete attachments. There was functionality added so that an engineer would request the deletion of an attachment. Email notification of this status request, record is "tagged" and goes into a table for internal staff review. Internal staff have the ability to delete or make attachment "inactive".

## Display Rules <h2>
**New Work Order**
TBD

**Edit Work Order**
TBD

## User Privilege Matrix <h2>
See excel spreadsheet
