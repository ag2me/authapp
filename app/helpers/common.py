import uuid

class Repeated:
    def __init__(self):
        pass

    def random_string(string_length=4):
        """Returns a random string of length string_length."""
        random = str(uuid.uuid4()) # Convert UUID format to a Python string.
        random = random.upper() # Make all characters uppercase.
        random = random.replace("-","") # Remove the UUID '-'.
        return random[0:string_length] # Return the random string.
    
    def dictfetchall(cursor):
        "Return all rows from a cursor as a dict"
        columns = [col[0] for col in cursor.description]
        return [
            dict(zip(columns, row))
            for row in cursor.fetchall()
        ]  

    def cleanup_query(query): 
        try:
            # replace all single qoute delimiter to double
            query = query.replace("'", "\"")

            # replace first delimiter
            query = query.replace("\"", "'",1)

            # replace last delimiter
            s = query
            old = '"'
            new = '\''
            maxreplace = 1

            return new.join(s.rsplit(old, maxreplace))
        except:
            print("Unable to cleanup")                     