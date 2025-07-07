// Sherlock Holmes characters
const names = [
  { first: 'Sherlock', last: 'Holmes' },
  { first: 'John', last: 'Watson' },
  { first: 'Irene', last: 'Adler' },
  { first: 'Mycroft', last: 'Holmes' },
  { first: 'Mary', last: 'Morstan' },
  { first: 'Inspector', last: 'Lestrade' },
  { first: 'Mrs', last: 'Hudson' },
  { first: 'Professor', last: 'Moriarty' },
  { first: 'Greg', last: 'Lestrade' },
  { first: 'Violet', last: 'Hunter' }
];
const ukCounties = [
  "Greater London", "Greater Manchester", "West Midlands", "Merseyside", "South Yorkshire", "West Yorkshire", "Kent", "Essex", "Surrey", "Hampshire", "Lancashire", "Devon", "West Sussex", "Nottinghamshire", "Staffordshire", "Cheshire", "Leicestershire", "Derbyshire", "Norfolk", "Lincolnshire", "North Yorkshire", "Cambridgeshire", "Hertfordshire", "Oxfordshire", "Gloucestershire", "Buckinghamshire", "Dorset", "Somerset", "Suffolk", "Warwickshire", "Wiltshire", "East Sussex", "Northamptonshire", "Bedfordshire", "Cornwall", "Shropshire", "Cumbria", "Worcestershire", "Berkshire", "East Riding of Yorkshire", "Isle of Wight", "Durham", "Northumberland", "Herefordshire", "Rutland", "Bristol", "Tyne and Wear", "West Lothian", "Edinburgh", "Aberdeenshire", "Fife", "Glasgow City", "Cardiff", "Swansea", "Newport", "Monmouthshire", "Powys", "Carmarthenshire", "Pembrokeshire", "Flintshire", "Wrexham", "Denbighshire", "Conwy", "Gwynedd", "Anglesey", "Ceredigion", "Neath Port Talbot", "Bridgend", "Vale of Glamorgan", "Rhondda Cynon Taf", "Caerphilly", "Torfaen", "Blaenau Gwent", "Merthyr Tydfil", "Scotland", "Wales", "Northern Ireland"
];
function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function getRandomCounty() {
  return getRandom(ukCounties);
}
function fillUKPhone() {
  return '07' + Math.floor(100000000 + Math.random() * 900000000);
}
function fillUKPostcode() {
  return 'SW1A1AA';
}
function fillField(field, value) {
  if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
    const prototype = Object.getPrototypeOf(field);
    const valueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;
    valueSetter.call(field, value);
    field.dispatchEvent(new Event('input', { bubbles: true }));
    field.dispatchEvent(new Event('change', { bubbles: true }));
    field.dispatchEvent(new Event('blur', { bubbles: true }));
  } else {
    field.value = value;
    field.dispatchEvent(new Event('input', { bubbles: true }));
    field.dispatchEvent(new Event('change', { bubbles: true }));
    field.dispatchEvent(new Event('blur', { bubbles: true }));
  }
}
function getLabelText(input) {
  let label = '';
  if (input.id) {
    const labelElem = document.querySelector(`label[for='${input.id}']`);
    if (labelElem) label = labelElem.innerText;
  }
  if (!label) {
    const parentLabel = input.closest('label');
    if (parentLabel) label = parentLabel.innerText;
  }
  if (!label) {
    let parent = input.parentElement;
    while (parent && parent !== document.body) {
      if (parent.tagName === 'DIV' || parent.tagName === 'SPAN') {
        if (parent.textContent && parent.textContent.length < 100) {
          label = parent.textContent;
          break;
        }
      }
      parent = parent.parentElement;
    }
  }
  return label.toLowerCase();
}
function getRandomDOB() {
  const now = new Date(),
    minYear = now.getFullYear() - 85,
    maxYear = now.getFullYear() - 20,
    year = Math.floor(Math.random() * (maxYear - minYear + 1)) + minYear,
    month = Math.floor(Math.random() * 12) + 1,
    daysInMonth = new Date(year, month, 0).getDate(),
    day = Math.floor(Math.random() * daysInMonth) + 1;
  return {
    day: String(day).padStart(2, '0'),
    month: String(month).padStart(2, '0'),
    year: String(year)
  };
}
function robustCheck(input) {
  let label = document.querySelector(`label[for='${input.id}']`);
  if (!label) label = input.closest('label');
  if (label) {
    label.click();
  } else if (input.type === 'checkbox' || input.type === 'radio') {
    const prototype = Object.getPrototypeOf(input);
    const checkedSetter = Object.getOwnPropertyDescriptor(prototype, 'checked').set;
    checkedSetter.call(input, true);
    input.dispatchEvent(new Event('click', { bubbles: true }));
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  } else {
    input.checked = true;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }
}
function selectNHSRadioAndFill() {
  const radioLabels = Array.from(document.querySelectorAll('label'));
  let yesRadio = null;
  radioLabels.forEach(label => {
    if (label.textContent.trim().toLowerCase().includes("yes, i know it")) {
      label.click();
      const input = label.querySelector('input[type="radio"]') || document.getElementById(label.getAttribute('for'));
      if (input) {
        input.checked = true;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        yesRadio = input;
      }
    }
  });
  if (yesRadio) {
    observeAndFillNHSNumber();
  }
}
function isPhoneField(input) {
  let label = (input.placeholder || input.name || getLabelText(input) || '').toLowerCase();
  if (label.includes('uk phone number') || /phone|tel|mobile/.test(label)) return true;
  let prev = input.previousSibling;
  while (prev) {
    if (prev.nodeType === Node.ELEMENT_NODE && prev.tagName === 'LABEL') {
      const text = prev.textContent.toLowerCase();
      if (text.includes('uk phone number') || /phone|tel|mobile/.test(text)) return true;
    }
    if (prev.nodeType === Node.TEXT_NODE) {
      const text = prev.textContent.toLowerCase();
      if (text.includes('uk phone number') || /phone|tel|mobile/.test(text)) return true;
    }
    prev = prev.previousSibling;
  }
  if (input.parentElement && input.parentElement.textContent.length < 100) {
    const text = input.parentElement.textContent.toLowerCase();
    if (text.includes('uk phone number') || /phone|tel|mobile/.test(text)) return true;
  }
  return false;
}
function fillNHSNumberField() {
  let nhsInput = document.querySelector('input[name="nhsNumber"]');
  if (!nhsInput) {
    nhsInput = Array.from(document.querySelectorAll('input')).find(input => input.placeholder && input.placeholder.replace(/\s/g, '').startsWith('000'));
  }
  if (!nhsInput) {
    const labels = Array.from(document.querySelectorAll('label'));
    labels.forEach(label => {
      if (label.textContent.trim().toLowerCase().includes('enter your nhs number')) {
        if (label.htmlFor) {
          nhsInput = document.getElementById(label.htmlFor);
        }
        if (!nhsInput) {
          nhsInput = label.querySelector('input');
        }
      }
    });
  }
  if (!nhsInput) {
    nhsInput = Array.from(document.querySelectorAll('input')).find(input => {
      const label = (input.placeholder || input.name || getLabelText(input) || '').toLowerCase();
      return label.includes('nhs number') || label.includes('enter your nhs number');
    });
  }
  if (nhsInput) {
    nhsInput.value = '1111111111';
    nhsInput.dispatchEvent(new Event('input', { bubbles: true }));
    nhsInput.dispatchEvent(new Event('change', { bubbles: true }));
    nhsInput.dispatchEvent(new Event('blur', { bubbles: true }));
    if (nhsInput.value.replace(/\D/g, '').length < 10) {
      nhsInput.value = '111 111 1111';
      nhsInput.dispatchEvent(new Event('input', { bubbles: true }));
      nhsInput.dispatchEvent(new Event('change', { bubbles: true }));
      nhsInput.dispatchEvent(new Event('blur', { bubbles: true }));
    }
  }
}
function fillForms() {
  const name = getRandom(names),
    data = {
      first: name.first,
      last: name.last,
      email: `${name.first.toLowerCase()}.${name.last.toLowerCase()}@example.co.uk`,
      city: 'London',
      address: '221B Baker Street',
      postcode: fillUKPostcode(),
      zip: fillUKPostcode(),
      phone: fillUKPhone(),
      mobile: fillUKPhone(),
      company: 'Scotland Yard',
      country: 'United Kingdom'
    },
    fieldMap = {
      first: ['first', 'fname', 'given'],
      last: ['last', 'lname', 'surname', 'family'],
      email: ['email'],
      city: ['city', 'town'],
      address: ['address', 'addr', 'street'],
      postcode: ['postcode', 'postal', 'zip'],
      zip: ['zip'],
      phone: ['phone', 'tel', 'mobile'],
      company: ['company', 'organisation', 'organization', 'employer'],
      country: ['country']
    },
    dob = getRandomDOB(),
    AGREEMENT_TEXT = "i have read and agreed to the terms of use and privacy policy",
    inputs = Array.from(document.querySelectorAll('input, textarea, select'));
  inputs.forEach(input => {
    let label = (input.placeholder || input.name || getLabelText(input) || '').toLowerCase();
    if (!label && input.closest('label')) label = input.closest('label').innerText.toLowerCase();
    if (!label && input.parentElement) {
      let parent = input.parentElement;
      while (parent && parent !== document.body) {
        if (parent.tagName === 'DIV' || parent.tagName === 'SPAN') {
          if (parent.textContent && parent.textContent.length < 100) {
            label = parent.textContent.toLowerCase();
            break;
          }
        }
        parent = parent.parentElement;
      }
    }
    if (label.includes('county')) {
      if (!input.value) fillField(input, getRandomCounty());
      return;
    }
    if (label.includes('day')) {
      if (!input.value) fillField(input, dob.day);
      return;
    }
    if (label.includes('month')) {
      if (!input.value) fillField(input, dob.month);
      return;
    }
    if (label.includes('year')) {
      if (!input.value) fillField(input, dob.year);
      return;
    }
    if (input.type === 'checkbox') {
      if (!input.checked) {
        const checkboxLabel = (getLabelText(input) + ' ' + (input.parentElement ? input.parentElement.textContent : '')).toLowerCase();
        if (checkboxLabel.match(/agree|consent|terms|policy|read/i) || checkboxLabel.includes(AGREEMENT_TEXT)) {
          robustCheck(input);
        }
      }
      return;
    }
    if (input.type === 'radio') {
      const labelText = (getLabelText(input) + ' ' + (input.parentElement ? input.parentElement.textContent : '')).toLowerCase();
      if ((labelText.trim() === 'no' || labelText.match(/^no\b/)) && !input.checked) {
        robustCheck(input);
      }
      return;
    }
    for (const key in fieldMap) {
      if (fieldMap[key].some(k => label.includes(k))) {
        if (!input.value) fillField(input, data[key]);
        return;
      }
    }
    if (input.type === 'text' && !input.value) {
      if (isPhoneField(input)) {
        fillField(input, fillUKPhone());
      } else {
        fillField(input, 'Sherlock Test');
      }
    }
  });
  selectNHSRadioAndFill();
  fillNHSNumberField();
  const checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"]'));
  checkboxes.forEach(checkbox => {
    const labelText = (getLabelText(checkbox) + ' ' + (checkbox.parentElement ? checkbox.parentElement.textContent : '')).toLowerCase();
    if (labelText.includes('email') && !checkbox.checked) {
      robustCheck(checkbox);
    }
  });
  const radios = Array.from(document.querySelectorAll('input[type="radio"]'));
  radios.forEach(radio => {
    const labelText = (getLabelText(radio) + ' ' + (radio.parentElement ? radio.parentElement.textContent : '')).toLowerCase();
    if ((labelText.trim() === 'no' || labelText.match(/^no\b/)) && !radio.checked) {
      robustCheck(radio);
    }
  });
}
function observeAndFillNHSNumber() {}

// Run the form fill when this script is loaded
fillForms();

// Set up a MutationObserver to re-run fillForms when the DOM changes (e.g., after clicking Next in a wizard)
let fillTimeout;
const observer = new MutationObserver(() => {
  clearTimeout(fillTimeout);
  fillTimeout = setTimeout(fillForms, 100); // Only run once every 100ms max
});
observer.observe(document.body, { childList: true, subtree: true }); 
