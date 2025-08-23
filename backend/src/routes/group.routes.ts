import { Router } from 'express';
import GroupController from '../controllers/group.controller';
import swaggerJsDoc, { Options } from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application } from "express";

const swaggerOptions: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Service Provider API",
      version: "1.0.0",
      description: "API documentation for Service Provider backend",
    },
    servers: [
      {
        url: "http://localhost:8000",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
export function setupSwagger(app: Application) {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}

const router = Router();

/**
 * @swagger
 * /api/groups/add_group:
 *   post:
 *     summary: Create a new group
 *     description: Create a new group with the provided details
 *     parameters:
 *       - in: body
 *         name: group
 *         description: Group object
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             subscription_validity:
 *               type: string
 *             group_validity:
 *               type: string
 *             alias:
 *               type: string
 *             tools:
 *               type: array
 *               items:
 *                 type: string
 *     responses:
 *       201:
 *         description: Group created successfully
 *       400:
 *         description: Bad request
 *       409:
 *         description: Conflict
 */
router.post('/add_group', GroupController.AddGroup);
/**
 * @swagger
 * /api/groups/get_groups:
 *   get:
 *     summary: Get all groups
 *     description: Retrieve a list of all groups
 *     responses:
 *       200:
 *         description: Groups retrieved successfully
 *       404:
 *         description: No groups found
 */
router.get('/getGroups', GroupController.GetGroups);
/**
 * @swagger
 * /api/groups/update_group/:groupId:
 *   put:
 *     summary: Update a group
 *     description: Update the details of a group
 *     parameters:
 *       - in: path
 *         name: groupId
 *         description: ID of the group to update
 *         required: true
 *         type: string
 *       - in: body
 *         name: group
 *         description: Group object
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             subscription_validity:
 *               type: string
 *             group_validity:
 *               type: string
 *             alias:
 *               type: string
 *             tools:
 *               type: array
 *               items:
 *                 type: string
 *     responses:
 *       200:
 *         description: Group updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Group not found
 */
router.put('/update/:groupId', GroupController.updateGroup);
/**
 * @swagger
 * /api/groups/delete/:groupId:
 *   delete:
 *     summary: Delete a group
 *     description: Delete a group by ID
 *     parameters:
 *       - in: path
 *         name: groupId
 *         description: ID of the group to delete
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Group deleted successfully
 *       404:
 *         description: Group not found
 */
router.delete('/delete/:groupId', GroupController.deleteGroup);
/**
 * @swagger
 * /api/groups/delete/batch:
 *   delete:
 *     summary: Delete groups in batch
 *     description: Delete multiple groups by their IDs
 *     parameters:
 *       - in: body
 *         name: groupIds
 *         description: Array of group IDs to delete
 *         required: true
 *         type: array
 *         items:
 *           type: string
 *     responses:
 *       200:
 *         description: Group deleted successfully
 *       404:
 *         description: Group not found
 */
router.delete('/delete/batch', GroupController.deleteGroup);

export default router;
