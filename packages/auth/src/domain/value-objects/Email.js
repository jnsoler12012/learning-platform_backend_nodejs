const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Email value object with validation and normalization
export class Email {
  constructor(value) {
    if (!value || !EMAIL_REGEX.test(value)) {
      throw new Error(`Invalid email address: ${value}`);
    }
    this.value = value.toLowerCase();
  }

  // Returns the normalized email string
  getValue() {
    return this.value;
  }
}
