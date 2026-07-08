sequenceDiagram
    autonumber
    actor Customer as Customer (Diner)
    actor Staff as Staff (Kitchen Crew)
    actor Admin as Admin (Manager)
    participant System as System (Blaine Wings Platform)

    Note over Customer, System: Phase 1: Browsing & Ordering
    Customer->>System: Scans table QR code
    System-->>Customer: Displays Customer Web App [Home] tab
    Customer->>System: Switches to [Menu] tab & selects category filters
    System-->>Customer: Displays filtered single-column menu items
    Customer->>System: Clicks '+' to add food items to order
    Customer->>System: Switches to [My Order] tab
    System-->>Customer: Displays review summary & calculated total

    opt Adjust Order Quantities
        Customer->>System: Clicks '+' or '-' buttons to modify quantity, or clicks trashcan icon
        System-->>Customer: Updates order list and recalculates Total
    End

    Customer->>System: Clicks 'Checkout' button
    
    Note over System, Admin: Phase 2: Order Processing & Fulfilling
    System-->>Admin: Updates Admin dashboard with live incoming order details
    System-->>Staff: Displays new order at the top of the kitchen queue monitor
    
    par Management Oversight & Kitchen Preparation
        Admin->>System: Views incoming order status to monitor live store traffic & sales
    and Food Preparation
        Staff->>System: Views incoming item entry sequence on display
        Note over Staff: Prepares food items in sequence
    end

    Staff->>System: Clicks 'Completed' on Staff interface
    System-->>Admin: Updates analytics display with successfully fulfilled order metrics