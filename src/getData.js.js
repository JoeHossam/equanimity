import { useState, useEffect, useCallback } from 'react';

export const api_url = 'http://localhost:3001/';

export const getData = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    return data;
};
