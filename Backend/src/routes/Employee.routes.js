export class EmployeeRoutes {
  static getRouter() {
    const router = Router();

    // API
    router.get('/profiles', EmployeeController.getAll);
    router.get('/myprofile/:id', EmployeeController.getById);
    router.post('/profiles', EmployeeController.create);
    router.put('/myprofile/:id', EmployeeController.updatePut);
    router.patch('/myprofile/:id', EmployeeController.update);
    router.delete('/employee/:id', EmployeeController.deleteById);

    // Vistas con Pug
    router.get('/views', async (req, res) => {
      try {
        const employees = await EmployeeController.getAllRaw();
        res.render('index', { employees });
      } catch (error) {
        res.status(500).send('Error al cargar la vista');
      }
    });

    return router;
  }
}
