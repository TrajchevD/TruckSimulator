const pool = require('../models/db');

  exports.getDashboardStats = async (req, res) => {
    try {
        const [employeeSales] = await pool.query(`
          SELECT e.EmployeeID, e.EmployeeName AS Name, e.EmployeeSurName AS Surname, COUNT(*) AS SalesCount, 
                 SUM(t.TotalPrice) AS TotalSales
          FROM procurement p
          JOIN t_type t ON t.TransactionID = p.TransactionID
          JOIN employee e ON e.EmployeeID = p.EmployeeID
          GROUP BY e.EmployeeID
        `);
        
        
        const [maintenanceStats] = await pool.query(`
          SELECT e.EmployeeID, e.EmployeeName AS Name, e.EmployeeSurName AS Surname, COUNT(*) AS MaintenanceDone
          FROM maintenance m
          JOIN employee e ON e.EmployeeID = m.EmployeeID
          WHERE m.Status = 'Completed'
          GROUP BY e.EmployeeID
        `);
  
      const [customerTotals] = await pool.query(`
        SELECT c.CustomerID, c.CustomerName, c.CustomerSurName, COUNT(*) AS Purchases, 
               SUM(t.TotalPrice) AS TotalSpent
        FROM procurement p
        JOIN customer c ON c.CustomerID = p.CustomerID
        JOIN t_type t ON t.TransactionID = p.TransactionID
        GROUP BY c.CustomerID
      `);
  
      const [averageMaintenanceTime] = await pool.query(`
        SELECT AVG(TIMESTAMPDIFF(MINUTE, StartTime, EndTime)) AS AvgMinutes
        FROM maintenance
        WHERE Status = 'Completed' AND StartTime IS NOT NULL AND EndTime IS NOT NULL
      `);
  
      const [totalProcurements] = await pool.query(`
        SELECT COUNT(*) AS TotalProcurements FROM procurement_request
      `);
  
      const [avgProcurementValue] = await pool.query(`
        SELECT AVG(TotalPrice) AS AvgProcurementValue FROM t_type
      `);
  
      const [totalRevenue] = await pool.query(`
        SELECT SUM(TotalPrice) AS TotalRevenue FROM t_type
      `);
  
      const [revenueSplit] = await pool.query(`
        SELECT Type, SUM(TotalPrice) AS Revenue FROM t_type GROUP BY Type
      `);
  
      res.json({
        employeeSales,
        maintenanceStats,
        customerTotals,
        averageMaintenanceTime: averageMaintenanceTime[0]?.AvgMinutes || 0,
        totalProcurements: totalProcurements[0]?.TotalProcurements || 0,
        avgProcurementValue: avgProcurementValue[0]?.AvgProcurementValue || 0,
        totalRevenue: totalRevenue[0]?.TotalRevenue || 0,
        revenueSplit
      });
    } catch (err) {
      console.error("Dashboard metrics fetch error:", err);
      res.status(500).json({ error: "Failed to fetch admin stats" });
    }
  };