def build_prompt(message: str, patient_context: dict | None = None) -> str:
    """Build the system and user prompt for the dental assistant."""
    base_prompt = """You are a helpful dental assistant for a clinic. Provide professional, empathetic, and helpful responses.
Keep responses concise and actionable. Do not provide medical diagnoses - recommend patients consult their dentist for specific concerns."""

    context_section = ""
    if patient_context:
        parts = []
        if patient_context.get("name"):
            parts.append(f"Patient name: {patient_context['name']}")
        if patient_context.get("medical_notes"):
            parts.append(f"Relevant medical notes: {patient_context['medical_notes']}")
        if parts:
            context_section = "\n\n" + "\n".join(parts) + "\n"

    return f"""{base_prompt}{context_section}

Patient question: {message}

Provide a professional and helpful response."""
