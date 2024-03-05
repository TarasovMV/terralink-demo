import {maskitoPhoneOptionsGenerator} from '@maskito/phone';
import metadata from 'libphonenumber-js/mobile/metadata';

export const PHONE_MASK = maskitoPhoneOptionsGenerator({countryIsoCode: 'RU', metadata});
