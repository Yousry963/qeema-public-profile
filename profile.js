"use strict";

const demoId = "e82efd1a-167d-4ce8-ba89-0cd4e0a55d42";
const demoProfile = {
  displayName: "Ahmed Yousry",
  givenName: "Ahmed",
  familyName: "Yousry",
  jobTitle: "SW Sr. Manager",
  workEmail: "ahmed.yousry@qeema.net",
  phoneNumbers: ["+20 11 2000 2004", "+20 10 0089 3963"],
  department: "Technology",
  workLocation: "Egypt",
  photoUrl: "assets/ahmed-yousry.jpg",
  professionalSummary: [
    "SW Sr. Manager and Solution Architect with 13+ years of software engineering experience, specializing in Java, Spring Boot, microservices, enterprise architecture, and platform modernization. Experienced in leading engineering teams.",
    "Software and solution architecture spans enterprise architecture, high-level design, architecture blueprints, system design, modernization, and architecture decision analysis. Backend engineering covers Java, Spring Boot, REST APIs, microservices, and distributed systems.",
  ],
  // Qeema roles only, oldest first; the page draws them as a journey.
  experience: [
    { role: "Development Manager", company: "Qeema", start: 2019, end: 2026 },
    { role: "SW Sr. Manager", company: "Qeema", start: 2026, end: null },
  ],
  certificates: [],
  keyProjects: [],
};

const pageUrl = new URL(window.location.href);
const publicId = pageUrl.searchParams.get("id") ?? demoId;

function dialNumber(phone) {
  return phone.replaceAll(" ", "");
}

function showPhoneNumbers(phones) {
  const container = document.getElementById("phone-numbers");
  const template = document.getElementById("phone-template");

  phones.forEach((phone, index) => {
    const row = template.content.cloneNode(true);
    row.querySelector("a").href = `tel:${dialNumber(phone)}`;
    row.querySelector(".detail__label").textContent = `Phone number ${index + 1}`;
    row.querySelector(".detail__value").textContent = phone;
    container.append(row);
  });
}

function appendTextItems(container, tag, items) {
  for (const text of items) {
    const item = document.createElement(tag);
    item.textContent = text;
    container.append(item);
  }
}

// Empty optional sections stay hidden; a visitor gains nothing from "none added".
function showOptionalList(id, items) {
  appendTextItems(document.getElementById(id), "li", items);
  document.getElementById(`${id}-section`).hidden = items.length === 0;
}

function showJourney(roles) {
  const journey = document.getElementById("experience");
  const template = document.getElementById("experience-template");
  const firstYear = Math.min(...roles.map((role) => role.start));
  const years = new Date().getFullYear() - firstYear;

  document.getElementById("journey-years").textContent = `${years}+`;
  document.getElementById("journey-roles").textContent = roles.length;
  document.getElementById("journey-since").textContent = firstYear;

  roles.forEach((role, index) => {
    const step = template.content.cloneNode(true);
    const current = role.end === null;
    step.querySelector("li").classList.toggle("journey__step--current", current);
    step.querySelector(".journey__tag").textContent =
      current ? "Today" : index === 0 ? "Joined Qeema" : "Promoted";
    step.querySelector("h3").textContent = role.role;
    step.querySelector(".journey__period").textContent =
      `${role.start} – ${current ? "Present" : role.end}`;
    journey.append(step);
  });
}

function showProfessionalDetails(profile) {
  appendTextItems(document.getElementById("professional-summary"), "p", profile.professionalSummary);
  showJourney(profile.experience);
  showOptionalList("certificates", profile.certificates);
  showOptionalList("projects", profile.keyProjects);
}

function showProfile(profile) {
  document.title = `${profile.displayName} · Qeema`;
  document.getElementById("employee-name").textContent = profile.displayName;
  document.getElementById("job-title").textContent = profile.jobTitle;
  document.getElementById("work-email").textContent = profile.workEmail;
  document.getElementById("work-email-link").href = `mailto:${profile.workEmail}`;
  document.getElementById("department").textContent = profile.department;
  document.getElementById("work-location").textContent = profile.workLocation;
  showPhoneNumbers(profile.phoneNumbers);
  showProfessionalDetails(profile);
  document.getElementById("quick-email").href = `mailto:${profile.workEmail}`;
  const quickCall = document.getElementById("quick-call");
  if (profile.phoneNumbers.length > 0) {
    quickCall.href = `tel:${dialNumber(profile.phoneNumbers[0])}`;
  } else {
    quickCall.hidden = true;
  }

  const portrait = document.getElementById("portrait");
  const initials = document.getElementById("initials");
  initials.textContent = profile.displayName.split(/\s+/).slice(0, 2)
    .map((name) => name[0]).join("");
  portrait.alt = `Portrait of ${profile.displayName}`;
  portrait.addEventListener("load", () => { portrait.hidden = false; }, { once: true });
  portrait.src = profile.photoUrl;

  const copyLink = document.getElementById("copy-link");
  copyLink.hidden = false;
  copyLink.addEventListener("click", copyProfileLink);
  document.getElementById("save-contact").addEventListener("click", () => saveContact(profile));
  document.getElementById("identity").hidden = false;
  document.getElementById("profile").hidden = false;
  document.getElementById("demo-note").hidden = false;
}

// Drifting points joined by thin lines, echoing the network backdrop on qeema.net.
function startNetwork() {
  const canvas = document.getElementById("network");
  const context = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const linkDistance = 130;
  let points = [];
  let width = 0;
  let height = 0;

  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    const count = Math.round(Math.min(70, (width * height) / 9000));
    points = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.6 + 0.6,
    }));
  }

  function draw() {
    context.clearRect(0, 0, width, height);
    for (const point of points) {
      point.x = (point.x + point.dx + width) % width;
      point.y = (point.y + point.dy + height) % height;
    }
    for (let i = 0; i < points.length; i += 1) {
      for (let j = i + 1; j < points.length; j += 1) {
        const distance = Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y);
        if (distance < linkDistance) {
          context.strokeStyle = `rgba(150, 160, 150, ${0.28 * (1 - distance / linkDistance)})`;
          context.lineWidth = 0.7;
          context.beginPath();
          context.moveTo(points[i].x, points[i].y);
          context.lineTo(points[j].x, points[j].y);
          context.stroke();
        }
      }
    }
    for (const point of points) {
      context.fillStyle = "rgba(170, 178, 170, 0.75)";
      context.beginPath();
      context.arc(point.x, point.y, point.r, 0, Math.PI * 2);
      context.fill();
    }
    if (!reduceMotion) window.requestAnimationFrame(draw);
  }

  resize();
  // Rebuild only when the hero really changes size (phones resize the window as the address bar slides).
  new ResizeObserver(() => {
    if (canvas.clientWidth === width && canvas.clientHeight === height) return;
    resize();
    if (reduceMotion) draw();
  }).observe(canvas);
  draw();
}

let feedbackTimer;
function showFeedback(message) {
  const feedback = document.getElementById("feedback");
  window.clearTimeout(feedbackTimer);
  feedback.textContent = message;
  feedbackTimer = window.setTimeout(() => { feedback.textContent = ""; }, 4100);
}

async function copyProfileLink() {
  if (!/^https?:$/.test(pageUrl.protocol)) {
    showFeedback("Open the preview on a web server to copy a link.");
    return;
  }

  const link = new URL(pageUrl.pathname, pageUrl.origin);
  link.searchParams.set("id", publicId);

  try {
    await navigator.clipboard.writeText(link.href);
    showFeedback("Profile link copied");
  } catch {
    const dialog = document.getElementById("share-dialog");
    const field = document.getElementById("share-url");
    field.value = link.href;
    dialog.showModal();
    field.select();
  }
}

function escapeVCard(value) {
  return value.replaceAll("\\", "\\\\")
    .replace(/\r\n|\r|\n/g, "\\n")
    .replaceAll(";", "\\;")
    .replaceAll(",", "\\,");
}

// vCard lines longer than 75 characters must continue on lines that start with a space.
function foldVCardLine(line) {
  const parts = [line.slice(0, 75)];
  for (let i = 75; i < line.length; i += 74) parts.push(` ${line.slice(i, i + 74)}`);
  return parts.join("\r\n");
}

// Returns the portrait as base64 JPEG, or null when it cannot be read (for example from file://).
async function portraitBase64(photoUrl) {
  try {
    const response = await fetch(photoUrl);
    if (!response.ok) return null;
    const bytes = new Uint8Array(await response.arrayBuffer());
    let binary = "";
    for (let i = 0; i < bytes.length; i += 0x8000) {
      binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    }
    return btoa(binary);
  } catch {
    return null;
  }
}

async function saveContact(profile) {
  const photo = await portraitBase64(profile.photoUrl);
  const profileLink = /^https?:$/.test(pageUrl.protocol)
    ? `${pageUrl.origin}${pageUrl.pathname}?id=${encodeURIComponent(publicId)}`
    : null;

  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${escapeVCard(profile.displayName)}`,
    `N:${escapeVCard(profile.familyName)};${escapeVCard(profile.givenName)};;;`,
    `ORG:Qeema;${escapeVCard(profile.department)}`,
    `TITLE:${escapeVCard(profile.jobTitle)}`,
    `EMAIL;TYPE=WORK:${escapeVCard(profile.workEmail)}`,
    ...profile.phoneNumbers.map((phone) => `TEL;TYPE=WORK,VOICE:${dialNumber(phone)}`),
    "URL;TYPE=WORK:https://www.qeema.net/",
    ...(profileLink ? [`URL:${profileLink}`] : []),
    ...(photo ? [`PHOTO;ENCODING=b;TYPE=JPEG:${photo}`] : []),
    "END:VCARD",
    "",
  ];
  const vCard = lines.map(foldVCardLine).join("\r\n");

  const url = URL.createObjectURL(new Blob([vCard], { type: "text/vcard;charset=utf-8" }));
  const download = document.createElement("a");
  download.href = url;
  download.download = `${profile.displayName.toLowerCase().replace(/\s+/g, "-")}.vcf`;
  document.body.append(download);
  download.click();
  download.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

startNetwork();
if (publicId === demoId) {
  showProfile(demoProfile);
} else {
  document.title = "Profile unavailable · Qeema";
  document.getElementById("unavailable").hidden = false;
}
