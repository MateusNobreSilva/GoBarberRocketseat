import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FiClock, FiPower } from "react-icons/fi";
import DayPicker, { DayModifiers } from "react-day-picker";
import "react-day-picker/lib/style.css";
import { isToday, format } from "date-fns";
import ptBr from "date-fns/locale/pt-BR";

import {
  Container,
  Header,
  HeaderContent,
  Profile,
  Content,
  Calendar,
  NextAppointment,
  Section,
  Appointment,
  Schedule,
} from "./styles";

import logoImg from "../../assets/logo.svg";
import { useAuth } from "../../hooks/auth";
import api from "../../services/api";
import ptBR from "date-fns/esm/locale/pt-BR/index.js";

// eslint-disable-next-line @typescript-eslint/class-name-casing
interface monthAvailabilityItem {
  day: number;
  available: boolean;
}

const Dashboard: React.FC = () => {
  // const { user } = useAuth();
  const { signOut, user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [monthAvailability, setMonthAvailability] = useState<monthAvailabilityItem[]>([]);

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    // setSelectedDate(day);
    if (modifiers.available) {
      setSelectedDate(day);
    }
  }, []);

  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month);
  }, []);

  useEffect(() => {
    api
      .get(`/providers/${user.id}/month-availability`, {
        params: {
          year: currentMonth.getFullYear(),
          month: currentMonth.getMonth() + 1,
        },
      })
      .then((response) => {
        setMonthAvailability(response.data);
      });
  }, [currentMonth, user.id]);

  const disabledDays = useMemo(() => {
    const dates = monthAvailability
      .filter((monthDay) => monthDay.available === false)
      .map((monthDay) => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        // eslint-disable-next-line no-return-assign
        return new Date(year, month, monthDay.day);
      });

    return dates;
  }, [currentMonth, monthAvailability]);

  // eslint-disable-next-line no-redeclare
  console.log(user);

  const selectedDateAsText = useMemo(() => {
    return format(selectedDate, "'Dia' dd 'de' MMMM", {
      locale: ptBR,
    });
  }, [selectedDate]);

  const selectedWeekDay = useMemo(() => {
    return format(selectedDate, "cccc", { locale: ptBR });
  }, [selectedDate]);

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="GoBarber" />

          <Profile>
            <img src={user.avatar_url} alt={user.name} />
            <div>
              <span>Bem-vindo</span>
              <strong>{user.name}</strong>
            </div>
          </Profile>
          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>

      <Content>
        <Schedule>
          <h1>Horários agendados</h1>
          <p>
            {isToday(selectedDate) && <span>Hoje</span>}
            <span>{selectedDateAsText}</span>
            <span>{selectedWeekDay}</span>
          </p>
          <NextAppointment>
            <strong>Atendimento a seguir</strong>

            <div>
              <img
                src="https://avatars.githubusercontent.com/u/58150931?v=4"
                alt="Mateus Nobre"
              />

              <strong> Mateus Nobre</strong>
              <span>
                <FiClock />
                08:00
              </span>
            </div>
          </NextAppointment>

          <Section>
            <strong>Manhã</strong>
            <Appointment>
              <span>
                <FiClock />
                08:00
              </span>

              <div>
                <img
                  src="https://avatars.githubusercontent.com/u/58150931?v=4"
                  alt="Mateus Nobre"
                />

                <strong> Mateus Nobre </strong>
              </div>
            </Appointment>
          </Section>
        </Schedule>
        <Calendar>
          <DayPicker
            weekdaysShort={["D", "S", "T", "Q", "Q", "S", "S"]}
            fromMonth={new Date()}
            disabledDays={[{ daysOfWeek: [0, 6] }, ...disabledDays]}
            modifiers={{
              available: { daysOfWeek: [1, 2, 3, 4, 5] },
            }}
            onMonthChange={handleMonthChange}
            selectedDays={selectedDate}
            onDayClick={handleDateChange}
            months={[
              "Janeiro",
              "Fevereiro",
              "Março",
              "Abril",
              "Maio",
              "Junho",
              "Julho",
              "Agosto",
              "Setembro",
              "Outubro",
              "Novembro",
              "Dezembro",
            ]}
          />
        </Calendar>
      </Content>
    </Container>
  );
};

export default Dashboard;
