// import { Reminders } from '../persist';
import { ReminderMetaOnce, ReminderMetaRelative, ReminderMetaTime } from '../types';
// import { Snowflake } from '@sapphire/snowflake';
// const snowflake = new Snowflake(SNOWFLAKE_EPOCH);

// interface ReminderStatic {
//     id?: string;
//     meta: (ReminderMetaRelative | ReminderMetaTime | ReminderMetaOnce);
// }

// export class Reminder implements ReminderStatic {
//     id: string;
//     meta: (ReminderMetaRelative | ReminderMetaTime | ReminderMetaOnce);

//     constructor(obj: ReminderStatic) {
//         if (obj.id == null) { obj.id = String(snowflake.generate()) }
//         Object.assign(this, obj)
//         // Reminders.push(this)
//     }
// }

export type Reminder = (ReminderMetaRelative | ReminderMetaTime | ReminderMetaOnce)