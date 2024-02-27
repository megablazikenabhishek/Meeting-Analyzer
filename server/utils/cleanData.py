# for similarity check
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def getSimilarity(text1, text2):
    vectorizer = TfidfVectorizer()
    vectorized_text1 = vectorizer.fit_transform([text1])
    vectorized_text2 = vectorizer.transform([text2])

    # Calculate cosine similarity
    cosine_sim = cosine_similarity(vectorized_text1, vectorized_text2)[0][0]

    # Convert similarity to percentage
    similarity_percentage = (cosine_sim + 1) * 50

    return similarity_percentage

def cleanData(data):
    result = []

    # sorting data based on length
    # data.sort(key=lambda x: len(x['text']), reverse=False)

    # print(len(data))

    for i in range(0, len(data)):
        for j in range(i+1, len(data)):
            if data[i]['name'] != data[j]['name']:  
                continue

            text1 = data[i]['text']
            text2 = data[j]['text']

            # getting similarity
            similarity = getSimilarity(text1, text2[:len(text1)])

            # print(f"{text1} ||| {text2} --> {similarity}")
            print(f"{similarity}")
            if similarity >= 97:
                data[i]['text'] = text2
    
    # adding only unique data to results
    for i in data:
        if i not in result:
            result.append(i)

    return result