export async function checkExistingContact(pool, fullname) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM contacts WHERE fullname = ?',
        [fullname]
      );
      return rows[0];
    } catch (error) {
      console.error('Error checking existing contact:', error);
      throw error;
    }
  }

  export async function getFeedbackById(pool, id) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM contacts WHERE id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      console.error('Error fetching feedback by id:', error);
      throw error;
    }
  }
  
  export async function deleteFeedback(pool, id) {
    try {
      await pool.query('DELETE FROM contacts WHERE id = ?', [id]);
    } catch (error) {
      console.error('Error deleting feedback:', error);
      throw error;
    }
  }
  
  export async function updateContact(pool, id, fullname, email, phone, message) {
    try {
      const [result] = await pool.query(
        'UPDATE contacts SET fullname = ?, email = ?, phone = ?, message = ? WHERE id = ?',
        [fullname, email, phone, message, id]
      );
      return result;
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  }
  
  
  export async function insertContact(pool, fullname, email, phone, message) {
    try {
      const [result] = await pool.query(
        'INSERT INTO contacts (fullname, email, phone, message) VALUES (?, ?, ?, ?)',
        [fullname, email, phone, message]
      );
      return result;
    } catch (error) {
      console.error('Error inserting contact:', error);
      throw error;
    }
  }

  export async function getAllContacts(pool) {
    try {
      const [result] = await pool.query(
        'SELECT * FROM contacts'
      );
      return result;
    } catch (error) {
      console.error('Error retriving all the contacts:', error);
      throw error;
    }
  }