import Appointment from "../models/Appointment";
import { startOfHour } from "date-fns";
import AppointmentsRepository from "../repository/Appointments.repository";
import { getCustomRepository } from "typeorm";

interface Request {
    date: Date;
    provider_id: string;
}

class CreateAppointmentService {

    public async execute({ date, provider_id }: Request): Promise<Appointment> {
        const appointmentsRepository = getCustomRepository(AppointmentsRepository);

        const appointmenteDate = startOfHour(date);

        const findedAppointmentInSameDate = await appointmentsRepository.findByDate(appointmenteDate);

        if (findedAppointmentInSameDate) {
            throw Error('this appointment already exists');
        }

        const appointment = appointmentsRepository.create({
            provider_id,
            date: appointmenteDate
        });

        await appointmentsRepository.save(appointment);

        return appointment;
    }
}

export default CreateAppointmentService;