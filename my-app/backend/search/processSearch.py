from flask import jsonify
from indic_transliteration.sanscript import transliterate, HK, DEVANAGARI
from db_controller import search_questions

def process_search_input(query):
    """
    Processes the search input by transliterating it if necessary 
    and performing a database search.

    - If query is in Hindi script, search directly.
    - If query is in English, convert it to Hindi using transliteration.

    Returns:
        JSON response containing matching questions.
    """
    try:
        # Check if input contains English characters
        if any(c.isalpha() and c not in "अआइईउऊऋएऐओऔकखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह" for c in query):
            query = transliterate(query, HK, DEVANAGARI)  # Convert to Hindi script

        # Fetch results from the database
        results = search_questions(query)

        # Return JSON response
        return jsonify({"search_query": query, "results": results})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
