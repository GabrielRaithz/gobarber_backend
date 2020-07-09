import { Router } from 'express';
import { parseISO } from "date-fns";
import AppointmentsRepository from "../repository/Appointments.repository";
import { getCustomRepository } from "typeorm";

import ensureAuthenticated from '../middlewares/ensureAuthenticated'

import CreateAppointmentService from '../services/CreateAppointmentService';

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.get('/', async (request, response) => {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);
    const allAppointments = await appointmentsRepository.find();

    return response.status(200).json(allAppointments);
})

appointmentsRouter.post('/', async (request, response) => {
    const { provider_id, date } = request.body;

    const parsedDate = parseISO(date);

    const createAppointment = new CreateAppointmentService();

    const appointment = await createAppointment.execute({ date: parsedDate, provider: provider_id })

    return response.json(appointment);
});


export default appointmentsRouter;