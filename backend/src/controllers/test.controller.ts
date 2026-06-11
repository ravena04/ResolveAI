import { Request, Response } from "express";

export const employeeRoute = (
  req: Request,
  res: Response
) => {
  res.json({
    success: true,
    message: "Employee Dashboard Accessed",
  });
};

export const agentRoute = (
  req: Request,
  res: Response
) => {
  res.json({
    success: true,
    message: "Agent Dashboard Accessed",
  });
};

export const adminRoute = (
  req: Request,
  res: Response
) => {
  res.json({
    success: true,
    message: "Admin Dashboard Accessed",
  });
};